import { Config } from "../../config";
import { buildPaymentController } from "../DI/Payment";
import { buildUploadController } from "../DI/Upload";
import PaymentController from "../controllers/PaymentController";
import UploadController from "../controllers/UploadController";

export interface buildAppResponse {
    controllers: {
        paymentController: PaymentController,
        uploadController: UploadController,
    }
}

export function buildApp(config: Config): buildAppResponse {
    return {
        controllers: {
            paymentController: buildPaymentController(config),
            uploadController: buildUploadController(config),
        }
    }
}
