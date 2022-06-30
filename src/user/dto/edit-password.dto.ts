import { IsNotEmpty, IsString, Matches } from "class-validator";
import { Match } from './match.decorator'

export class EditPasswordDto {

    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @IsString()
    @IsNotEmpty()
    @Matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$','', {
        message: 'Password must be minimum 8 characters and contains at least one lower characters, one upper characters, one digit, one special character',
    })
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    @Match('newPassword', { message: 'Invalid Password Confirmation' })
    passwordConfirm: string;

}