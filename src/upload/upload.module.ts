import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { LoggerMiddleware } from "../common/middlewares/logger.middleware";
import { UploadController } from "./upload.controller";

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .exclude(
      //   { path: 'example', method: RequestMethod.GET },
      // )
      .forRoutes(UploadController);
  }
}
