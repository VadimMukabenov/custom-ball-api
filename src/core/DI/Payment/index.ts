import type { Config } from "../../../config";
import { getYooKassaClient } from "../../../libs/yookassa";
import PaymentController from "../../controllers/PaymentController";
import PaymentService from "../../services/PaymentService";

export function buildPaymentController(config: Config) {
    const yookassaClient = getYooKassaClient(config);

    const paymentService = new PaymentService(yookassaClient);
    const paymentController = new PaymentController(paymentService);

    return paymentController;
}