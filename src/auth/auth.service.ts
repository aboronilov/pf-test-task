import { Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {

    }
    signup() {
        return {msg: "Signed UP"}
    }
    signin() {
        return {msg: "Signed IN"}
    }
}