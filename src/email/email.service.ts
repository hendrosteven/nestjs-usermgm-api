import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

    constructor(private config: ConfigService) { }

    async sendEmail(userId: string, name: string, email: string) {
        const port = Number(process.env.MAILGUN_SMTP_PORT || this.config.get('PORT'));
        const hostname = process.env.MAILGUN_SMTP_SERVER || this.config.get('HOSTNAME');        
        const username = process.env.MAILGUN_SMTP_LOGIN || this.config.get('USERNAME');
        const password = process.env.MAILGUN_SMTP_PASSWORD || this.config.get('PASSWORD');        
        const domain = process.env.MAILGUN_SMTP_SERVER != null ? 'https://user-app-ui.herokuapp.com/verify?id=' : this.config.get('DOMAIN') ;
        const path = domain + userId;
 
        const transporter = nodemailer.createTransport({
            host: hostname,
            port: port,
            secure: false,
            requireTLS: true,
            auth: {
                user: username,
                pass: password,
            },
            logger: true
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Register" <info@domain.com>',
            to: email,
            subject: "Please Verify Your Email",
            html: "Hello "+name+" please click <a href='"+path+"'>verify my email address</a> to activate you account",
            headers: { 'x-myheader': 'test header' }
        });

        console.log("Message sent: %s", info.response);
    }

}
