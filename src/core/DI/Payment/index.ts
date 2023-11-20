import type { Config } from "../../../config";
import { getYooKassaClient } from "../../../libs/yookassa";
import PaymentController from "../../controllers/PaymentController";
import PaymentService from "../../services/PaymentService";
import UploadService from "../../services/UploadService";
import { getS3Client } from "../../../libs/s3Client";

export function buildPaymentController(config: Config) {
    const yookassaClient = getYooKassaClient(config);

    const s3Client = getS3Client(config);
    const uploadService = new UploadService(s3Client);
    const paymentService = new PaymentService(yookassaClient, uploadService);
    const paymentController = new PaymentController(paymentService);

    return paymentController;
}