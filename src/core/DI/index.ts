import { Config } from "../../config";
import { buildPaymentController } from "../DI/Payment";
import { buildUploadController } from "../DI/Upload";
import PaymentController from "../controllers/PaymentController";
import UploadController from "../controllers/UploadController";
import Container from "./container";

export interface buildAppResponse {
    controllers: {
        paymentController: PaymentController,
        uploadController: UploadController,
    };
}

export async function buildApp(container: typeof Container): Promise<buildAppResponse> {
    return {
        controllers: {
            paymentController: await buildPaymentController(container),
            uploadController: buildUploadController(container),
        },
    }
}
