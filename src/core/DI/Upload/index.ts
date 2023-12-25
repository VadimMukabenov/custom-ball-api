import UploadService from "../../services/UploadService";
import UploadController from "../../controllers/UploadController";
import type { Config } from "../../../config";
import { getS3Client } from "../../../libs/s3Client";
import Container from "../../DI/container";

export function buildUploadController(container: typeof Container) {
    const { config, externalServices } = container;
    const { emailService, redisService } = externalServices;
    const s3Client = getS3Client(config);
    console.log("upload DI", emailService, redisService)

    const uploadService = new UploadService(s3Client, emailService, redisService);
    const uploadController = new UploadController(uploadService);

    return uploadController;
}