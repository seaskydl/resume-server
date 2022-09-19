import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerMiddleware } from "common/middlewares/logger.middleware";
import { ResumeactiveController } from "./resumeactive.controller";
import { ResumeactiveService } from "./resumeactive.servive";
import { ResumeactiveSchema } from "./schemas/resumeactive.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Resumeactive", schema: ResumeactiveSchema }]),
  ],
  controllers: [ResumeactiveController],
  providers: [ResumeactiveService],
})
export class ResumeactiveModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .exclude(
      //   { path: 'example', method: RequestMethod.GET },
      // )
      .forRoutes(ResumeactiveController);
  }
}