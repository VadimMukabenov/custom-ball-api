"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYooKassaClient = void 0;
const yoo_checkout_1 = require("@a2seven/yoo-checkout");
const getYooKassaClient = (config) => {
    const checkout = new yoo_checkout_1.YooCheckout({
        shopId: config.YOOKASSA_SHOP_ID,
        secretKey: config.YOOKASSA_SECRET_KEY
    });
    return checkout;
};
exports.getYooKassaClient = getYooKassaClient;
//# sourceMappingURL=yookassa.js.map