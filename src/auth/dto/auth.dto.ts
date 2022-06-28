import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { Match } from './match.decorator'

export class AuthDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$','', {
        message: 'Password must be minimum 8 characters and contains at least one lower characters, one upper characters, one digit, one special character',
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    @Match('password', { message: 'Invalid Password Confirmation' })
    passwordConfirm: string;

    @IsString()
    @IsNotEmpty()
    fullName: string
}