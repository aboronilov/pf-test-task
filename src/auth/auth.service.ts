import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }
    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password)
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                }
            })
            delete user.hash;
            return user;
        } catch (error) {
            if (
                error instanceof
                PrismaClientKnownRequestError
            ) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        'User with this email allready exists',
                    );
                }
            }
            throw error;
        }
    }
    async signin(dto: AuthDto) {
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: {
                    email: dto.email
                }
            })
            const pwMatches = await argon.verify(dto.password, user.hash);
            if (!pwMatches) {
                throw new ForbiddenException("Wrong credentials are given")
            }
            delete user.hash;
            return user;
        } catch (error) {
            throw error;
        }

    }
}