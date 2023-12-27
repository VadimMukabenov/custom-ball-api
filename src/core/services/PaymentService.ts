import { IConfirmationType, ICreatePayment, IPaymentMethodType, Payment } from "@a2seven/yoo-checkout";
import { YooCheckout } from '@a2seven/yoo-checkout';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import type { RedisClientType } from 'redis';
import RedisClientService from "../../libs/redisClientService";

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
    private redisClient: RedisClientType;

    constructor(
        yookassaClient: YooCheckout, 
        s3Client: S3Client,
        redisClient: RedisClientType,
    ) {
        this.yookassaClient = yookassaClient;
        this.s3Client = s3Client;
        this.redisClient = redisClient;
    }

    async run(params: paymentPayload, cloudDirName: string, email: string) {
        const idempotenceKey = uuidv4();
        const createPayload = this.getPayload(params);
        try {
            const payment = await this.yookassaClient.createPayment(createPayload, idempotenceKey);
            
            await this.redisClient.hSet(email, payment.id, cloudDirName);
            await this.redisClient.hSet(email, 'payment_id', payment.id);
            
            this.checkPaymentAndUploadConfirmation(payment.id, email);

            return payment.confirmation.confirmation_url;
        } catch (error) {
            console.error(error);
        }
        
    }

    checkPaymentAndUploadConfirmation(paymentId: string, email: string) {
        // Отправка запроса провайдеру для проверки оплаты платежа
        const interval = setInterval(async () => {
            
            const payment = await this.yookassaClient.getPayment(paymentId);
            
            // Если платеж оплачен, останавливаем интервал
            if (payment.status === 'succeeded') {
                clearInterval(interval);
                
                await this.redisClient.hSet(email, "payment_status", "succeeded");
                

                await this.uploadPaymentConfirmation(payment, email);
                // console.log('Платеж успешно оплачен');
                
            }

            if(payment.status === "canceled") {
                
                await this.redisClient.hSet(email, "payment_status", "canceled");
                
                // console.log(`Оплата с id: ${payment.id} и client email: ${email} не прошла!`);
            }
        }, 1000 * 60); // Проверка каждую минуту

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

    async uploadPaymentConfirmation(payment: Payment, email: string) {
        // const data = JSON.stringify(payment);
        const data = "Статус: Оплачен";

        const folderName = await this.redisClient.hGet(email, payment.id);
        const bucketName = process.env.AWS_BUCKET_NAME;

        const params = {
            Bucket: bucketName, 
            Key: `${folderName}/payment.txt`,
            Body: data,
        };

        const upload = await this.s3Client.send(new PutObjectCommand(params));
        
    }
}

export default PaymentService;