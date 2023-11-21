import { Request, Response } from "express";
import PaymentService from "../services/PaymentService";

class PaymentController {
    paymentService: PaymentService;
    constructor(paymentService: PaymentService) {
        this.paymentService = paymentService;
    }

    async run(req: Request, res: Response) {
        try {
            console.log('req.body', req.body)
            const { amount, payment_method_type, confirmation } = req.body;
            const confirmationUrl = await this.paymentService.run({ amount, payment_method_type, confirmation });
            res.json({ 
                status: 200, 
                data: {
                    confirmation_url: confirmationUrl
                }
            });
        } catch (err) {
            console.error(err);
            res.json({ status: 500, mes: err });
        }
    }
}

export default PaymentController;