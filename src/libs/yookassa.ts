import { YooCheckout } from '@a2seven/yoo-checkout';
import type { Config } from "../config";

export const getYooKassaClient = (config: Config) => {
    const checkout = new YooCheckout({ 
        shopId: config.YOOKASSA_SHOP_ID, 
        secretKey: config.YOOKASSA_SECRET_KEY 
    });

    return checkout;
}