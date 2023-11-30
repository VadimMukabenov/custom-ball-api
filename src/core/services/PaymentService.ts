import { IConfirmationType, ICreatePayment, IPaymentMethodType, Payment } from "@a2seven/yoo-checkout";
import { YooCheckout } from '@a2seven/yoo-checkout';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import type { RedisClientType } from 'redis';

interface paymentPayload {
    amount: number;
    payment_method_type: IPaymentMethodType;
    confirmation: {
        type: IConfirmationType,
        return_url: string;
    };
}

class PaymentService {
    yookassaClient: YooCheckout;
    s3Client: S3Client;
    redisClient: RedisClientType;

    constructor(
        yookassaClient: YooCheckout, 
        s3Client: S3Client,
        redisClient: RedisClientType,
    ) {
        this.yookassaClient = yookassaClient;
        this.s3Client = s3Client;
        this.redisClient = redisClient;
    }

    async run(params: paymentPayload, cloudDirName: string) {
        const idempotenceKey = uuidv4();
        const createPayload = this.getPayload(params);
        try {
            const payment = await this.yookassaClient.createPayment(createPayload, idempotenceKey);
            
            await this.redisClient.hSet('yandex-cloud-bucket', payment.id, cloudDirName);

            this.checkPaymentAndUploadConfirmation(payment.id);

            return payment.confirmation.confirmation_url;
        } catch (error) {
            console.error(error);
        }
        
    }

    checkPaymentAndUploadConfirmation(paymentId: string) {
        // Отправка запроса провайдеру для проверки оплаты платежа
        const interval = setInterval(async () => {
            const payment = await this.yookassaClient.getPayment(paymentId);
            
            // Если платеж оплачен, останавливаем интервал
            if (payment.status === 'succeeded') {
                clearInterval(interval);
                await this.uploadPaymentConfirmation(payment);
                // console.log('Платеж успешно оплачен');
                
            }
        }, 5000); // Проверка каждые 5 секунд

        setTimeout(() => {
            // если никто не оплатил в течении часа, удаляем интервал.
            clearInterval(interval);
        }, (1000 * 60 * 60)); // an hour
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
            receipt: {
                items: [{
                    description: 'Мяч Спартак',
                    amount: {
                        value: `${params.amount}`,
                        currency: 'RUB'
                    },
                    vat_code: 1,
                    quantity: "1",
                    payment_subject: "commodity",
                    payment_mode: "full_prepayment"
                }],
                customer: {
                    phone: "+79164556267",
                    email: "am@muniev.ru",
                }
            },
            capture: true,
        };

        return createPayload;
    }

    async uploadPaymentConfirmation(payment: Payment) {
        // const data = JSON.stringify(payment);
        const data = "Статус: Оплачен";

        const folderName = await this.redisClient.hGet('yandex-cloud-bucket', payment.id);
        const bucketName = process.env.AWS_BUCKET_NAME;

        const params = {
            Bucket: bucketName, 
            Key: `${folderName}/payment.txt`,
            Body: data,
        };

        const upload = await this.s3Client.send(new PutObjectCommand(params));
        // console.log(upload);
    }
}

export default PaymentService;