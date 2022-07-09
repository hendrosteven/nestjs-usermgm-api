import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {

    constructor(private config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: process.env.MAILGUN_SMTP_SERVER != null ? config.get('DATABASE_URL_HEROKU') : config.get('DATABASE_URL'),
                },
            },
        });
    }

}