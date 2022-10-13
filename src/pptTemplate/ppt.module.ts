import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerMiddleware } from "common/middlewares/logger.middleware";
import { PPTController } from "./ppt.controller";
import { PPTService } from "./ppt.service";
import { PPTSchema } from "./schemas/ppt.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: "PPT", schema: PPTSchema }])],
  controllers: [PPTController],
  providers: [PPTService],
})
export class PPTModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .exclude(
      //   { path: 'example', method: RequestMethod.GET },
      // )
      .forRoutes(PPTController);
  }
}
