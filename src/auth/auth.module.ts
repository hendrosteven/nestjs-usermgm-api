import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { EmailModule } from "../email/email.module";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from "./strategy";

@Module({
    imports: [JwtModule.register({}), EmailModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}