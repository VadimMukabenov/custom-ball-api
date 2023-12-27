import { Config, getConfig } from "../../config";
import EmailService, { smtpConfig } from "../../libs/emailService";
import RedisClientService from "../../libs/redisClientService";
import type { RedisClientOptions, RedisClientType } from 'redis';
import dotenv from 'dotenv';

type ContainerEntities = {
    [className: string]: any;
}

type ExternalServicesType = {
    redisClient: RedisClientType;
    emailService: EmailService;
}

class Container {
    config: Config;
    controllers: ContainerEntities;
    services: ContainerEntities;
    externalServices: ExternalServicesType;

    constructor(config: Config) {
        this.config = config;
        this.controllers = {};
        this.services = {};
        // TODO. Сделать нормальные универсальные типы
        // с дженериками чтобы typescript сам подхватывал какой сервис был добавлен в контейнер
        // @ts-ignore
        this.externalServices = {};
    }

    async init() {
        const redisClient = await this.getRedisService();
        const emailService = this.getEmailService();

        this.setExternalService("redisClient", redisClient);
        this.setExternalService("emailService", emailService);

        return this;
    }

    private setExternalService(className: keyof ExternalServicesType, classInstance: any): void {
        this.externalServices[className] = classInstance;
    }


    // setExternalService(className: keyof ExternalServicesType, classInstance: ExternalServicesType[keyof ExternalServicesType]): void {
    //     this.externalServices[className] = classInstance;
    // }

    private getEmailService(account?: { 
        user: string, 
        pass: string 
    }) {
        
        const smtpConfig: smtpConfig = {
            host: this.config.EMAIL_HOST,
            port: Number(this.config.EMAIL_PORT),
            secure: false,
            service: this.config.EMAIL_SERVICE,
            auth: {
                user: account?.user || this.config.EMAIL_USERNAME || "test",
                pass: account?.pass || this.config.EMAIL_PASSWORD || "test",
            },
        }
        
        const emailService = new EmailService(smtpConfig);

        return emailService;
    }

    private async getRedisService(options?: RedisClientOptions) {
        return (new RedisClientService(options)).connect();
    }
}

//For env File 
dotenv.config();

const config = getConfig();

export default new Container(config);
