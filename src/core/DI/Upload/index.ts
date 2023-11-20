import UploadService from "../../services/UploadService";
import UploadController from "../../controllers/UploadController";
import type { Config } from "../../../config";
import { getS3Client } from "../../../libs/s3Client";

export function buildUploadController(config: Config) {
    const s3Client = getS3Client(config);

    const uploadService = new UploadService(s3Client);
    const uploadController = new UploadController(uploadService);

    return uploadController;
}