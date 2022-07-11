import { IsEmail, IsNotEmpty } from "class-validator";


export class ResendDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

}