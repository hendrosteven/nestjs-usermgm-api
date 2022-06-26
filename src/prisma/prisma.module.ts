import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule extends PrismaClient{

    constructor() {
        super({
            datasources: {
                db: {
                    url: 'postgresql://postgres:12345@localhost:5434/users?schema=public',
                },
            },
        });
    }

    cleanDb() {
        return this.$transaction([
            this.session.deleteMany(),
            this.user.deleteMany()
        ]);
    }
}
