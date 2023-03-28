import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from '../src/prisma/prisma.service';

describe("App e2e", () => {
   let app: INestApplication;
   let prisma: PrismaService;
   beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
         imports: [AppModule]
      }).compile();
      app = moduleRef.createNestApplication();
      app.useGlobalPipes(new ValidationPipe({
         whitelist: true,
       }));
       await app.init();
       prisma = app.get(PrismaService);
       await prisma.cleanDb();
   });
   afterAll(() => {
      app.close();
   })
   
   describe("Auth", () => {
      describe("Register", () => {
         it.todo("should register");
      });

      describe("Login", () => {
         it.todo("should login");
      });
   })

   describe("User", () => {
      describe("Get current user", () => {});

      describe("Edit user", () => {});
   })

   describe("Bookmark", () => {
      describe("Get bookmarks", () => {});

      describe("Create bookmark", () => {});

      describe("Create bookmark by id", () => {});

      describe("Edit bookmark", () => {});

      describe("Delete bookmark", () => {});
   })
})