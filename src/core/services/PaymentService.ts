import { IConfirmationType, ICreatePayment, IPaymentMethodType, Payment } from "@a2seven/yoo-checkout";
import { YooCheckout } from '@a2seven/yoo-checkout';
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import UploadService from "./UploadService";
import fs from "fs";

interface paymentPayload {
    amount: number;
    payment_method_type: IPaymentMethodType;
    confirmation: {
        type: IConfirmationType,
        return_url: string;
    }
}

class PaymentService {
    yookassaClient: YooCheckout;
    uploadService: UploadService;
    constructor(yookassaClient: YooCheckout, uploadService: UploadService) {
        this.yookassaClient = yookassaClient;
        this.uploadService = uploadService;
    }

    async run(params: paymentPayload) {
        const idempotenceKey = uuidv4();
        const createPayload = this.getPayload(params);
        try {
            const payment = await this.yookassaClient.createPayment(createPayload, idempotenceKey);
            
            this.checkPayment(payment.id);
            return payment.confirmation.confirmation_url;
        } catch (error) {
            console.error(error);
        }
        
    }

    checkPayment(paymentId: string) {
        // Отправка запроса провайдеру для проверки оплаты платежа
        const interval = setInterval(async () => {
        const paymentInfo = await this.yookassaClient.getPayment(paymentId);
        
        // Если платеж оплачен, останавливаем интервал
        if (paymentInfo.status === 'succeeded') {
            clearInterval(interval);
            // console.log('Платеж успешно оплачен');
            
        }
        }, 5000); // Проверка каждые 5 секунд
    }

    getPayload(params: paymentPayload) {
        const createPayload: ICreatePayment = {
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

    // writeTxtFile(payment: Payment) {
    //     const data = JSON.stringify(payment);
    //     fs.writeFile('payment.txt', data, (err) => {
    //         if (err) {
    //             console.error(err);
    //         } else {
    //             console.log('File created successfully');
    //             const fileContent = fs.readFile('payment.txt', (err, data) => {
    //                 if (err) {
    //                   console.error(err);
    //                 } else {
    //                   const params = {
    //                     Bucket: 'your-bucket-name',
    //                     Key: 'payment.txt',
    //                     Body: data
    //                   };
                
    //                   s3.upload(params, (err, data) => {
    //                     if (err) {
    //                       console.error(err);
    //                     } else {
    //                       console.log('File uploaded successfully to', data.Location);
    //                     }
    //                   });
    //                 }
    //               });
    //         }
    //     });
    // }
}

export default PaymentService;