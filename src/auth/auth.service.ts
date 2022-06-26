import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService{
    signup(){
        return 'Signup OK';
    }

    signin(){
        return 'Signin OK'
    }
}