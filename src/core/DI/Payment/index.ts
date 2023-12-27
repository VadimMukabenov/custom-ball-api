import { getYooKassaClient } from "../../../libs/yookassa";
import PaymentController from "../../controllers/PaymentController";
import PaymentService from "../../services/PaymentService";
import { getS3Client } from "../../../libs/s3Client";
import Container from "../../DI/container";

export async function buildPaymentController(container: typeof Container) {
    const { config, externalServices } = container;
    const { redisClient } = externalServices;
    
    const yookassaClient = getYooKassaClient(config);
    const s3Client = getS3Client(config);

    const paymentService = new PaymentService(yookassaClient, s3Client, redisClient);
    const paymentController = new PaymentController(paymentService);

    return paymentController;
}