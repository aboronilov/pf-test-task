import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redis from "cache-manager-redis-store"
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reditStore: any = redis.redisStore

@Module({
  imports: [
    ConfigModule.forRoot({      
      isGlobal: true
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    CacheModule.register({
      store: reditStore,
      socket: {
        host: "localhost",
        port: 6379
      },
      isGlobal: true
    })
  ],
})
export class AppModule { }
