import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { SigninDto } from './dto/signin.dto';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "src/email/email.service";

@Injectable({})
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService, private emailService: EmailService) { }

    async signup(dto: SignupDto) {
        //generate the password
        const hash = await argon.hash(dto.password);
        //save to db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hash,
                    source: 'email',
                    fullName: dto.fullName,
                    verified: false
                }
            });
            delete user.hash;
            //send email
            this.emailService.sendEmail(user.id, dto.fullName, dto.email);
            //return saved user
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') { //duplicate error
                    throw new ForbiddenException(['Email already taken']);
                }
            } else {
                throw error;
            }
        }
    }

    async signin(dto: SigninDto) {
        //find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        });
        //if user not exist throw exception
        if (!user) throw new ForbiddenException(['Invalid email or password'])

        //compare password
        const pwdMatches = await argon.verify(user.hash, dto.password);
        //if password incorrect throw excption
        if (!pwdMatches) throw new ForbiddenException(['Invalid email or password']);
        //if unverified 
        if (!user.verified) throw new ForbiddenException(['Please check your email to activate your account or click on resend activation link below']);
        //send back valid token
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: string, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '60m',
            secret: secret,
        });

        return {
            'access_token': token,
        }
    }

    async verify(userId: string) {
        try {
            //find user by email
            const user = await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    verified: true
                }
            });
            //if user not exist throw exception
            if (!user) throw new ForbiddenException('User not found')
            //send back valid token
            return this.signToken(user.id, user.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.log(error.code);
                if (error.code === 'P2025') { //id not found
                    throw new HttpException({
                        status: HttpStatus.BAD_REQUEST,
                        error: "User not found"
                    }, HttpStatus.BAD_REQUEST);
                }
            } else {
                throw error;
            }
        }
    }

}