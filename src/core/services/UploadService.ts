import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import archiver from "archiver";
import stream from "stream";

type uploadFilesType = {
    [fieldname: string]: Express.Multer.File[];
} | Express.Multer.File[];

class UploadService {
    s3Client: S3Client;

    constructor(s3Client: S3Client) {
        this.s3Client = s3Client;
    }

    async run(files: uploadFilesType, email: string) {
        // const uploads = [];

        if(!(files instanceof Array)) {
            return;
        }
        
        const date = this.getDate();

        await this.archiveAndUploadFiles(files, email, date);
        
        return {
            cloudDirName: `${date}_${email}`,
        };
    }

    streamTo(date: string, email: string, key: string) {
        const _pass = new stream.PassThrough();
        const bucketName = process.env.AWS_BUCKET_NAME;
        const folderName = `${date}_${email}`;
        const params = {
            Bucket: bucketName, 
            Key: `${folderName}/${key}`,
            Body: _pass,
        };
        
        const upload = this.s3Client.send(new PutObjectCommand(params));
        return _pass;
    }

    async archiveAndUploadFiles(files: uploadFilesType, email: string, date: string) {
        if(!(files instanceof Array)) {
            return;
        }

        const FILENAME = `${date}_${email}.zip`;
        // this way no need to save files to disk
        const output = this.streamTo(date, email, FILENAME);

        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
        });
        
        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', function() {
            console.log('Data has been drained');
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

        archive.pipe(output);

        for(let file of files) {
            archive.append(file.buffer, { name: `${file.fieldname}/${file.originalname}` });
        }

        archive.finalize();
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