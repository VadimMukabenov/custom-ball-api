import type { Config } from "../../../config";
import { getYooKassaClient } from "../../../libs/yookassa";
import PaymentController from "../../controllers/PaymentController";
import PaymentService from "../../services/PaymentService";
import { getS3Client } from "../../../libs/s3Client";
import { getRedisClient } from "../../../libs/redisClient";

export async function buildPaymentController(config: Config) {
    const yookassaClient = getYooKassaClient(config);
    const s3Client = getS3Client(config);
    const redisClient = await getRedisClient(config);

    const paymentService = new PaymentService(yookassaClient, s3Client, redisClient);
    const paymentController = new PaymentController(paymentService);

    return paymentController;
}