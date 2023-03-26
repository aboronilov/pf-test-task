import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";

@Controller("auth")
export class AuthController {
    constructor (private authService: AuthService) {}

    @Post("signup")
    signup(@Body() dto: any){
        return this.authService.signup();
    }

    @Post("signin")
    signin(){
        return this.authService.signin();
    }
}