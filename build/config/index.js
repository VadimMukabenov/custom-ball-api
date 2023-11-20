"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const getConfig = () => ({
    NODE_ENV: process.env.NODE_ENV || "development",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || "",
    AWS_REGION: process.env.AWS_REGION || "",
    AWS_ENDPOINT_URL: process.env.AWS_ENDPOINT_URL || "",
    YOOKASSA_SHOP_ID: process.env.YOOKASSA_SHOP_ID || "",
    YOOKASSA_SECRET_KEY: process.env.YOOKASSA_SECRET_KEY || "",
    APP_PORT: process.env.APP_PORT,
});
exports.getConfig = getConfig;
//# sourceMappingURL=index.js.map