import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategorySchema } from "category/schemas/category.schema";
import { LoggerMiddleware } from "common/middlewares/logger.middleware";
import { RequestipSchema } from "requestip/schemas/requestip.schema";
import { ResumeSchema } from "resume/schemas/resume.schema";
import { ResumeactiveSchema } from "resumeactive/schemas/resumeactive.schema";
import { UserresumeSchema } from "userResume/schemas/userresume.schema";
import { UserSchema } from "users/schemas/user.schema";
import { SponsorSchema } from "./schemas/sponsor.schemas";
import { UnauthController } from "./unauth.controller";
import { UnauthService } from "./unauth.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Resume", schema: ResumeSchema }]),
    MongooseModule.forFeature([{ name: "Sponsor", schema: SponsorSchema }]),
    MongooseModule.forFeature([{ name: "Category", schema: CategorySchema }]),
    MongooseModule.forFeature([
      { name: "Resumeactive", schema: ResumeactiveSchema },
    ]),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    MongooseModule.forFeature([{ name: "Requestip", schema: RequestipSchema }]),
    MongooseModule.forFeature([
      { name: "Userresume", schema: UserresumeSchema },
    ]),
  ],
  controllers: [UnauthController],
  providers: [UnauthService],
})
export class UnauthModel implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .exclude(
      //   { path: 'example', method: RequestMethod.GET },
      // )
      .forRoutes(UnauthController);
  }
}
