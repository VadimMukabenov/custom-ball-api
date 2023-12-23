import { Config } from "../../config";
import { buildPaymentController } from "../DI/Payment";
import { buildUploadController } from "../DI/Upload";
import PaymentController from "../controllers/PaymentController";
import UploadController from "../controllers/UploadController";

export interface buildAppResponse {
    controllers: {
        paymentController: PaymentController,
        uploadController: UploadController,
    };
}

export async function buildApp(config: Config): Promise<buildAppResponse> {
    return {
        controllers: {
            paymentController: await buildPaymentController(config),
            uploadController: buildUploadController(config),
        },
    }
}
