import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategorySchema } from "category/schemas/category.schema";
import { LoggerMiddleware } from "common/middlewares/logger.middleware";
import { ResumeSchema } from "resume/schemas/resume.schema";
import { ResumeactiveService } from "resumeactive/resumeactive.servive";
import { ResumeactiveSchema } from "resumeactive/schemas/resumeactive.schema";
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
