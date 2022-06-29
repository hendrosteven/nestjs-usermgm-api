import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

    constructor(private config: ConfigService) { }

    async sendEmail(userId: string, name: string, email: string) {
        const hostname = this.config.get('HOSTNAME');
        const username = this.config.get('USERNAME');
        const password = this.config.get('PASSWORD');
        const port = this.config.get('PORT');

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
            html: "Hello "+name+" please click <a href='http://google.com'>verify my email address</a> to activate you account",
            headers: { 'x-myheader': 'test header' }
        });

        console.log("Message sent: %s", info.response);
    }

}
