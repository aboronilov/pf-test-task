import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { EditUserDto } from './dto';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
   constructor(
      private prisma: PrismaService,
      @Inject(CACHE_MANAGER) private cacheManager: Cache
   ) {}

   async editUser (userId: number, dto: EditUserDto) {
      const user = await this.prisma.user.update({
         where: {
            id: userId,
         },
         data: {
            ...dto,
         },
      });
      delete user.hash;

      return user
   }

   // async cachedSession(email: string) {
   //    console.log(email)
   //    const cachedData = await this.cacheManager.get(email)
   //    if (!cachedData) {
   //       throw new BadRequestException("No data cached for this email")
   //    }
   //    return cachedData
   // }
}
