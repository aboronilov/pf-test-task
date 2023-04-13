import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from "pactum";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';

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
      await app.listen(3333)
      prisma = app.get(PrismaService);
      await prisma.cleanDb();
      pactum.request.setBaseUrl("http://localhost:3333")
   });
   afterAll(() => {
      app.close();
   })

   describe("Auth", () => {
      const body: AuthDto = {
         email: "johndoe@gmail.com",
         password: "secret"
      };

      describe("Signup", () => {
         it("should fail signup without email", () => {
            return pactum
               .spec()
               .post("/auth/signup")
               .withBody({ password: body.password })
               .expectStatus(400)
         })
         it("should fail signup with incorrect email", () => {
            return pactum
               .spec()
               .post("/auth/signup")
               .withBody({
                  email: "123",
                  password: body.password
               })
               .expectStatus(400)
         })
         it("should fail signup without password", () => {
            return pactum
               .spec()
               .post("/auth/signup")
               .withBody({ email: body.email })
               .expectStatus(400)
         })
         it("should fail signup without email and password", () => {
            return pactum
               .spec()
               .post("/auth/signup")
               .expectStatus(400)
         })
         it("should signup", () => {
            return pactum
               .spec()
               .post("/auth/signup")
               .withBody(body)
               .expectStatus(201)
         });
      });

      describe("Login", () => {
         it("should fail signin without email", () => {
            return pactum
               .spec()
               .post("/auth/signin")
               .withBody({ password: body.password })
               .expectStatus(400)
         })
         it("should fail signin without password", () => {
            return pactum
               .spec()
               .post("/auth/signin")
               .withBody({ email: body.email })
               .expectStatus(400)
         })
         it("should fail signin without email and password", () => {
            return pactum
               .spec()
               .post("/auth/signin")
               .expectStatus(400)
         })
         it("should signin", () => {
            return pactum
               .spec()
               .post("/auth/signin")
               .withBody(body)
               .expectStatus(200)
         });
         it("should login", () => {
            return pactum
               .spec()
               .post("/auth/signin")
               .withBody(body)
               .expectStatus(200)
               .stores("userToken", "access_token")
         });
      });
   })

   describe("User", () => {
      describe("Get current user", () => { 
         it("should get current user", () => {
            return pactum
            .spec()
            .withHeaders({
               Authorization: `Bearer $S{userToken}`
            })
            .get("/users/me")
            .expectStatus(200)
         })
       });

      describe("Edit user", () => { 
         const dto: EditUserDto = {
            firstName: "John",
            lastName: "Doe"
         };
         it("should update current user", () => {
            return pactum
            .spec()
            .withHeaders({
               Authorization: `Bearer $S{userToken}`
            })
            .patch("/users")
            .withBody(dto)
            .expectStatus(200)
            .expectBodyContains(dto.firstName)
            .expectBodyContains(dto.lastName)
         })
       });
   })   
})