import { Controller, Get, Patch, UseGuards, Body, Inject, CACHE_MANAGER } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { Cache } from 'cache-manager';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
   constructor(
      private userService: UserService,
      @Inject(CACHE_MANAGER) private cacheManager: Cache  
   ) { }

   @Get("me")
   async getMe(@GetUser() user: User) {
      return user;
   }

   @Patch()
   editUser(
      @GetUser("id") userId: number,
      @Body() dto: EditUserDto
   ) {
      return this.userService.editUser(userId, dto);
   }

   // @Get("cached-session")
   // async getCachedSession(@GetUser("email") email: string) {
   //    return this.userService.cachedSession(email)
   // }
}
