import { CACHE_MANAGER, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Cache } from "cache-manager";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("User with this email allready exists");
        }
      }
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email: dto.email,
        },
      });
      const pwMatches = await argon.verify(user.hash, dto.password);
      if (!pwMatches) {
        throw new ForbiddenException("Wrong credentials are given");
      }      
      return this.signToken(user.id, user.email);
    } catch (error) {
      throw error;
    }
  }
  async signToken(
    userId: number,
    email: string
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get("JWT_SECRET");

    const token = await this.jwt.signAsync(payload, {
      expiresIn: "5m",
      secret: secret,
    });

    await this.cacheManager.set(email, token)

    const cached = await this.cacheManager.get(email)
    if (cached) {
      console.log(`Session token for ${email} successfully cached`)
    }

    return {
      access_token: token,
    };
  }
  
}
