import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface smtpConfig {
    host: string,
    port: number,
    secure?: boolean,
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
        service: "gmail",
        auth: {
            user: config.auth.user,
            pass: config.auth.pass,
        },
        secure: false,
    });

    console.log('transporter', transporter.options)

    return transporter;
};

export default EmailService;