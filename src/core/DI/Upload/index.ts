import UploadService from "../../services/UploadService";
import UploadController from "../../controllers/UploadController";
import type { Config } from "../../../config";
import { getS3Client } from "../../../libs/s3Client";
import Container from "../../DI/container";

export function buildUploadController(config: Config) {
    const s3Client = getS3Client(config);
    const emailService = Container.getEmailService();

    const uploadService = new UploadService(s3Client, emailService);
    const uploadController = new UploadController(uploadService);

    return uploadController;
}