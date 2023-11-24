import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

type uploadFilesType = {
    [fieldname: string]: Express.Multer.File[];
} | Express.Multer.File[];

class UploadService {
    s3Client: S3Client;
    constructor(s3Client: S3Client) {
        this.s3Client = s3Client;
    }
    async run(files: uploadFilesType, email: string) {
        const uploads = [];

        if(!(files instanceof Array)) {
            return;
        }
        
        files.forEach((file) => {
            let buffer = file.buffer;
            if (buffer) {
                const date = this.getDate();
                const bucketName = process.env.AWS_BUCKET_NAME;
                const filePath = `${date}_${email}/${file.fieldname}/${file.originalname}`;

                const params = {
                    Bucket: bucketName, 
                    Key: filePath,
                    Body: buffer,
                };
                
                const upload = this.s3Client.send(new PutObjectCommand(params));
                uploads.push(upload);
            }
        });

        const resp = await Promise.all(uploads);
        console.log(resp)
    }

    // async uploadTxt(file) {
    //     const date = this.getDate();
    //     const bucketName = process.env.AWS_BUCKET_NAME;
    //     const filePath = `${date}_${email}/user-info/${file.originalname}`;
    //     const params = {
    //         Bucket: bucketName, 
    //         Key: filePath,
    //         Body: buffer,
    //     };
    //     const upload = this.s3Client.send(new PutObjectCommand(params))
    // }

    getDate() {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${day}-${month}-${year}-${hours}:${minutes}`;
    }
}

export default UploadService;