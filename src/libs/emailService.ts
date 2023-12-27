import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface smtpConfig {
    host: string,
    port: number,
    secure?: boolean,
    service: string,
    auth: {
      user: string,
      pass: string,
    },
};

class EmailService {
    private readonly mailer: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    constructor(config: smtpConfig) {
        this.mailer = getEmailClient(config);
    }

    async sendEmail(options: Mail.Options) {
        return this.mailer.sendMail(options);
    }
}

function getEmailClient(config: smtpConfig) {
    const transporter = nodemailer.createTransport({
        host: config.host,
        port: Number(config.port),
        // service: config.service,
        auth: {
            user: config.auth.user,
            pass: config.auth.pass,
        },
        secure: true,
        tls: {
            ciphers:'SSLv3'
        }
    });

    return transporter;
};

export default EmailService;
