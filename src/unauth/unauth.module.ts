import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerMiddleware } from "common/middlewares/logger.middleware";
import { ResumeSchema } from "resume/schemas/resume.schema";
import { SponsorSchema } from "./schemas/sponsor.schemas";
import { UnauthController } from "./unauth.controller";
import { UnauthService } from "./unauth.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Resume", schema: ResumeSchema }]),
    MongooseModule.forFeature([{ name: "Sponsor", schema: SponsorSchema }]),
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
