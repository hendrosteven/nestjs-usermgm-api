import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { AuthService } from './auth.service';
import { SignupDto } from './dto';
import { SigninDto } from './dto/signin.dto';


@Controller('auth')
export class AuthController{

    constructor(private authService: AuthService){}

    @Post('signup')
    signup(@Body() dto: SignupDto){
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: SigninDto){
        return this.authService.signin(dto);
    }

    @Get('/verify/:id')
    verify(@Param('id') userId: string){
        return this.authService.verify(userId);
    }
}