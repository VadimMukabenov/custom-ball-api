import { IYooCheckoutOptions, YooCheckout } from '@a2seven/yoo-checkout';

export const getYooKassaClient = (config: IYooCheckoutOptions) => {
    const checkout = new YooCheckout(config);

    return checkout;
}
