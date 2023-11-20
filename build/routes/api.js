"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApi = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const router = (0, express_1.Router)();
function buildApi(params) {
    const { uploadController, paymentController, } = params.controllers;
    router.post('/v1/upload', upload.any(), uploadController.run.bind(uploadController));
    router.post('/v1/payment/create', paymentController.run.bind(paymentController));
    router.get('/success', (req, res) => {
        res.json({ mes: 'Спасибо за оплату!!!!' });
    });
    return router;
}
exports.buildApi = buildApi;
//# sourceMappingURL=api.js.map