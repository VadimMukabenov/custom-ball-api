import { Config, getConfig } from "../../config";
import EmailService, { smtpConfig } from "../../libs/emailService";
import dotenv from 'dotenv';

class Container {
    config: Config;
    constructor(config: Config) {
        this.config = config;
    }

    getEmailService(account?: { 
        user: string, 
        pass: string 
    }) {
        
        const smtpConfig: smtpConfig = {
            host: this.config.EMAIL_HOST,
            port: Number(this.config.EMAIL_PORT),
            secure: false,
            auth: {
                user: account?.user || this.config.EMAIL_USERNAME || "test",
                pass: account?.pass || this.config.EMAIL_PASSWORD || "test",
            },
        }

        const emailService = new EmailService(smtpConfig);

        return emailService;
    }
}

//For env File 
dotenv.config();

const config = getConfig();

export default new Container(config);
