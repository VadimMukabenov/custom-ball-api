"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaymentController = void 0;
const yookassa_1 = require("../../../libs/yookassa");
const PaymentController_1 = __importDefault(require("../../controllers/PaymentController"));
const PaymentService_1 = __importDefault(require("../../services/PaymentService"));
function buildPaymentController(config) {
    const yookassaClient = (0, yookassa_1.getYooKassaClient)(config);
    const paymentService = new PaymentService_1.default(yookassaClient);
    const paymentController = new PaymentController_1.default(paymentService);
    return paymentController;
}
exports.buildPaymentController = buildPaymentController;
//# sourceMappingURL=index.js.map