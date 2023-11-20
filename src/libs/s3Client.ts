import type { Config } from "../config";
import { S3Client } from "@aws-sdk/client-s3";

export const getS3Client = (config: Config): S3Client => {
    return new S3Client({ 
        region: config.AWS_REGION, 
        endpoint: config.AWS_ENDPOINT_URL,
        credentials: {
            accessKeyId: config.AWS_ACCESS_KEY_ID,
            secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        }
    });
};