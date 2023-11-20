import { Router } from 'express';
import multer from "multer";
import { buildAppResponse } from "../core/DI";

const upload = multer();
const router = Router();

export function buildApi(params: buildAppResponse): Router {
    const {
        uploadController,
        paymentController,
    } = params.controllers;

    router.post('/v1/upload', upload.any(), uploadController.run.bind(uploadController));

    router.post('/v1/payment/create', paymentController.run.bind(paymentController));

    router.get('/success', (req, res) => {
        res.json({ mes: 'Спасибо за оплату!!!!' })
    })

    return router;
}
