"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class PaymentService {
    constructor(yookassaClient) {
        this.yookassaClient = yookassaClient;
    }
    run(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const idempotenceKey = (0, uuid_1.v4)();
            const createPayload = this.getPayload(params);
            try {
                const payment = yield this.yookassaClient.createPayment(createPayload, idempotenceKey);
                this.checkPayment(payment.id);
                console.log('==== PAYMENT!! ===', payment);
                return payment.confirmation.confirmation_url;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    checkPayment(paymentId) {
        // Отправка запроса провайдеру для проверки оплаты платежа
        const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            const paymentInfo = yield this.yookassaClient.getPayment(paymentId);
            // Если платеж оплачен, останавливаем интервал
            if (paymentInfo.status === 'succeeded') {
                clearInterval(interval);
                console.log('Платеж успешно оплачен');
            }
        }), 5000); // Проверка каждые 5 секунд
    }
    getPayload(params) {
        const createPayload = {
            amount: {
                value: `${params.amount}`,
                currency: 'RUB'
            },
            payment_method_data: {
                type: `${params.payment_method_type}`
            },
            confirmation: {
                type: `${params.confirmation.type}`,
                return_url: `${params.confirmation.return_url}`
            },
            capture: true,
        };
        return createPayload;
    }
}
exports.default = PaymentService;
//# sourceMappingURL=PaymentService.js.map