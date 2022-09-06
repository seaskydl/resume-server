import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerMiddleware } from "common/middlewares/logger.middleware";
import { UserresumeSchema } from "userResume/schemas/userresume.schema";
import { UserresumeService } from "userResume/userresume.service";
import { ResumeController } from "./resume.controller";
import { ResumeService } from "./resume.service";
import { ResumeSchema } from "./schemas/resume.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Resume", schema: ResumeSchema }]),
    MongooseModule.forFeature([
      { name: "Userresume", schema: UserresumeSchema },
    ]),
  ],
  controllers: [ResumeController],
  providers: [ResumeService, UserresumeService],
})
export class ResumeModel implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .exclude(
      //   { path: 'example', method: RequestMethod.GET },
      // )
      .forRoutes(ResumeController);
  }
}
