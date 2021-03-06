import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { AuthService } from './auth.service';
import { SignupDto } from './dto';
import { ResendDto } from "./dto/resend.dto";
import { SigninDto } from './dto/signin.dto';
import { SocialSigninDto } from './dto/social-signin.dto';


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

    @HttpCode(HttpStatus.OK)
    @Post('social/signin')
    socialSignin(@Body() dto: SocialSigninDto){
        return this.authService.socialSignin(dto);
    }

    @Get('/verify/:id')
    verify(@Param('id') userId: string){
        return this.authService.verify(userId);
    }

    @Post('resend')
    resend(@Body() dto: ResendDto){
        return this.authService.resend(dto);
    }

}