export const getConfig = () => ({
    NODE_ENV: process.env.NODE_ENV || "development",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || "",
    AWS_REGION: process.env.AWS_REGION || "",
    AWS_ENDPOINT_URL: process.env.AWS_ENDPOINT_URL || "",
    YOOKASSA_SHOP_ID: process.env.YOOKASSA_SHOP_ID || "",
    YOOKASSA_SECRET_KEY: process.env.YOOKASSA_SECRET_KEY || "",
    APP_PORT: process.env.APP_PORT,
    EMAIL_HOST: process.env.EMAIL_HOST || "",
    EMAIL_PORT: process.env.EMAIL_PORT || 0,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME || "",
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || "",
    EMAIL_RECIEVER1: process.env.EMAIL_RECIEVER1 || "",
    EMAIL_RECIEVER2: process.env.EMAIL_RECIEVER2 || "",
    EMAIL_SEND_TIMEOUT: process.env.EMAIL_SEND_TIMEOUT || 0,
});

export type Config = ReturnType<typeof getConfig>;
