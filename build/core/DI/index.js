"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = void 0;
const Payment_1 = require("../DI/Payment");
const Upload_1 = require("../DI/Upload");
function buildApp(config) {
    return {
        controllers: {
            paymentController: (0, Payment_1.buildPaymentController)(config),
            uploadController: (0, Upload_1.buildUploadController)(config),
        }
    };
}
exports.buildApp = buildApp;
//# sourceMappingURL=index.js.map