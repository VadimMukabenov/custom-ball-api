import UploadService from "../../services/UploadService";
import UploadController from "../../controllers/UploadController";
import { getS3Client } from "../../../libs/s3Client";
import Container from "../../DI/container";

export function buildUploadController(container: typeof Container) {
    const { config, externalServices } = container;
    const { emailService, redisClient, yookassaClient } = externalServices;
    const s3Client = getS3Client(config);

    const uploadService = new UploadService(
        s3Client, 
        emailService, 
        redisClient,
        yookassaClient,
    );
    
    const uploadController = new UploadController(uploadService);

    return uploadController;
}