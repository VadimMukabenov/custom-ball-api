"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
class UploadService {
    constructor(s3Client) {
        this.s3Client = s3Client;
    }
    run(files, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploads = [];
            if (!(files instanceof Array)) {
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
                    const upload = this.s3Client.send(new client_s3_1.PutObjectCommand(params));
                    uploads.push(upload);
                }
            });
            const resp = yield Promise.all(uploads);
            console.log(resp);
        });
    }
    getDate() {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
}
exports.default = UploadService;
//# sourceMappingURL=UploadService.js.map