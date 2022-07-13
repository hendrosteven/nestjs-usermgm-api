import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SocialSigninDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    provider: string;
}