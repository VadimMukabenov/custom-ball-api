import { GetObjectCommand, S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import archiver from "archiver";
import stream, { Readable } from "stream";

import EmailService from "../../libs/emailService";
import { Attachment } from "nodemailer/lib/mailer";
import { RedisClientType } from "redis";

type uploadFilesType = {
    [fieldname: string]: Express.Multer.File[];
} | Express.Multer.File[];

type uploadToInputType = {
    bucket: string;
    key: string;
    body: string | Uint8Array | Buffer | Readable;
}

type createUrlInputType = {
    client: S3Client;
    bucket: string;
    key: string;
    expiresIn?: number;
}

type UserData = {
    full_name: string;
    email: string;
    phone: string;
    address: string;
}

type sendEmailInputType = {
    emailTo: string;
    user: UserData;
    urlToS3Object?: string | undefined;
    fileName?: string | undefined;
    fileContent?: string | Buffer | stream.Readable | undefined;
    type: "success" | "failure";
    description?: string;
    isOrderPaid?: boolean;
}



class UploadService {
    s3Client: S3Client;
    private emailService: EmailService;
    private redisClient: RedisClientType;

    constructor(s3Client: S3Client, emailService: EmailService, redisClient: RedisClientType) {
        this.s3Client = s3Client;
        this.emailService = emailService;
        this.redisClient = redisClient;
    }

    async run(files: uploadFilesType, user: UserData) {
        const { email, full_name, phone, address } = user;
        
        if(!(files instanceof Array)) {
            return;
        }
        
        const date = this.getDate();

        const bucketName = process.env.AWS_BUCKET_NAME;
        const folderName = `${date}_${email}`;
        const fileName = `${date}_${email}.zip`;
        const key = `${folderName}/${fileName}`;
        const emailReciever = process.env.EMAIL_RECIEVER;
     
        const { uploadStream } = await this.archive(files);
        console.time("upload")

        const upload = this.uploadTo({
            bucket: bucketName,
            key,
            body: uploadStream,
        })
        
        upload
            .then((uploadResult) => {
                const s3DownloadUrlPromise = this.createPresignedUrlWithClient({
                    client: this.s3Client,
                    bucket: bucketName,
                    key,
                    expiresIn: 3600 * 24 * 7,
                });

                s3DownloadUrlPromise
                    .then((s3DownloadUrl) => {
                        setTimeout(async () => {
                            try {
                                const paymentStatus = await this.redisClient.hGet(email, "payment_status");

                                if(paymentStatus === "succeeded") {
                                    const emailInfoPromise = await this.sendEmail({
                                        emailTo: emailReciever,
                                        type: "success",
                                        user,
                                        urlToS3Object: s3DownloadUrl,
                                    });
                                } else {
                                    await this.sendEmail({
                                        emailTo: emailReciever,
                                        user,
                                        type: "failure",
                                        description: "Платеж отменили самостоятельно, истекло время на принятие платежа или платеж был отклонен ЮKassa или платежным провайдером"
                                    });
                                }
                            } catch (error) {
                                console.log("Error while sending success email",error);
                                this.sendEmail({
                                    emailTo: emailReciever,
                                    user,
                                    type: "failure"
                                });
                            }
                        }, 1000 * 60 * 1); // 15 minutes
                    })
                    .catch((err) => {
                        console.log(`Error while getting s3DownloadUrl`, err);
                        this.sendEmail({
                            emailTo: emailReciever,
                            user,
                            type: "failure"
                        });
                    });
            })
            .catch((err) => {
                console.log(`Error while uploading`, err);
                this.sendEmail({
                    emailTo: emailReciever,
                    user,
                    type: "failure"
                });
            });
        

        console.timeEnd("upload")
        return {
            cloudDirName: `${date}_${email}`,
        };
    }

    createPresignedUrlWithClient({ client, bucket, key, expiresIn = 3600 }: createUrlInputType) {
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        return getSignedUrl(client, command, { expiresIn });
    }

    uploadTo({ bucket, key, body }: uploadToInputType) {
        const params = {
            Bucket: bucket, 
            Key: `${key}`,
            Body: body,
        };
        
        return this.s3Client.send(new PutObjectCommand(params));
    }

    sendEmail({ emailTo, user, type, urlToS3Object, fileName, fileContent, description, isOrderPaid }: sendEmailInputType) {
        let attachments: Attachment[] | undefined;
        let html: string | undefined = "";
        let subject: string = "Новый заказ";

        if(type === "failure") {
            subject = "Ошибка при создании заказа, свяжитесь с клиентом"
        }

        if(urlToS3Object) {
            html = `
                <a href="${urlToS3Object}">Скачать файлы с макетом</a>
            `;
        }

        if(user) {
            html += `
                <br>
                ФИО: ${user.full_name || ""};
                <br>
                Телефон: ${user.phone || ""};
                <br>
                Email: ${user.email || ""};
                <br>
                Адрес: ${user.address || ""};
                <br>
                Общая сумма: 5000 руб.
                <br>
                Сумма доставки: 500 руб.
                <br>
                Статус оплаты: ${isOrderPaid ? "Оплачен" : "Не оплачен"}
                ${description || ""}
            `;
        }
        
        if(fileName && fileContent) {
            attachments = [
                {
                    filename: `${fileName}.zip`,
                    content: fileContent,
                }
            ];
        }
        
        
        const emailInfo = this.emailService.sendEmail({
            from: "unmanned08@yandex.ru",
            to: emailTo,
            subject,
            html,
            attachments,
        });

        return emailInfo;
    }

    async archive(files: uploadFilesType) {
        if(!(files instanceof Array)) {
            return;
        }

        // this way no need to save files to disk
        const archiver = this.getArchiveStream();

        const uploadStream = new stream.PassThrough();
        // const emailStream = new stream.PassThrough();
        
        // archiver.pipe(output);

        archiver.pipe(uploadStream);
        // archiver.pipe(emailStream);

        this.handleStreamErrors(uploadStream, archiver);
        // this.handleStreamErrors(emailStream, archiver);

        for(let file of files) {
            archiver.append(file.buffer, { name: `${file.fieldname}/${file.originalname}` });
        }
        
        archiver.finalize();

        return {
            uploadStream,
            // emailStream
        }
    }

    getArchiveStream() {
        try {
            const archive = archiver('zip', {
                zlib: { level: 9 } // Sets the compression level.
            });
    
            // good practice to catch warnings (ie stat failures and other non-blocking errors)
            archive.on('warning', function(err) {
                if (err.code === 'ENOENT') {
                // log warning
                } else {
                // throw error
                throw err;
                }
            });
            
            // good practice to catch this error explicitly
            archive.on('error', function(err) {
                throw err;
            });
    
            archive.on('close', () => {
                console.log('Transform stream ended, buffer emptied.');
                // Reset the transform stream and readable streams for the next request
                archive.removeAllListeners();
            });
    
            return archive;
        } catch(err){
            console.log(err);
        }
    }

    handleStreamErrors(outputStream: stream.PassThrough, archiveStream) {
        outputStream.on("error", (err) => {
            console.log("error", err)
        });

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        outputStream.on('close', function() {
            console.log(archiveStream.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            outputStream.removeAllListeners();
        });
        
        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        outputStream.on('end', function() {
            console.log('Data has been drained');
        });
    }

    getDate() {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${day}-${month}-${year}-${hours}:${minutes}:${seconds}`;
    }
}

export default UploadService;

// files.forEach((file) => {
        //     let buffer = file.buffer;
        //     if (buffer) {
        //         const bucketName = process.env.AWS_BUCKET_NAME;
        //         const filePath = `${date}_${email}/${file.fieldname}/${file.originalname}`;
                
        //         const params = {
        //             Bucket: bucketName, 
        //             Key: filePath,
        //             Body: buffer,
        //         };
                
        //         const upload = this.s3Client.send(new PutObjectCommand(params));
        //         uploads.push(upload);
        //     }
        // });

        // const resp = await Promise.all(uploads);
        // console.log(resp)



        // this.uploadTo({
        //     bucket: bucketName,
        //     key,
        //     body: uploadStream,
        // })
        //     .then(async (uploadResult) => {
        //         const s3DownloadUrl = await this.createPresignedUrlWithClient({
        //             client: this.s3Client,
        //             bucket: bucketName,
        //             key,
        //             expiresIn: 3600 * 24 * 7,
        //         });
        
        //         const emailInfoPromise = await this.sendEmail({
        //             emailTo: emailReciever,
        //             type: "success",
        //             user,
        //             urlToS3Object: s3DownloadUrl,
        //         });

        //         console.log(`message sent`, emailInfoPromise.accepted)
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })