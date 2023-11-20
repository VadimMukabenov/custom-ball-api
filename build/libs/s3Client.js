"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getS3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const getS3Client = (config) => {
    return new client_s3_1.S3Client({
        region: config.AWS_REGION,
        endpoint: config.AWS_ENDPOINT_URL,
        credentials: {
            accessKeyId: config.AWS_ACCESS_KEY_ID,
            secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        }
    });
};
exports.getS3Client = getS3Client;
//# sourceMappingURL=s3Client.js.map