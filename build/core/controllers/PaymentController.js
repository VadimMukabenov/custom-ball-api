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
class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    run(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, payment_method_type, confirmation } = req.body;
                const confirmationUrl = yield this.paymentService.run({ amount, payment_method_type, confirmation });
                res.json({
                    status: 200,
                    data: {
                        confirmation_url: confirmationUrl
                    }
                });
            }
            catch (err) {
                console.error(err);
                res.json({ status: 500, mes: err });
            }
        });
    }
}
exports.default = PaymentController;
//# sourceMappingURL=PaymentController.js.map