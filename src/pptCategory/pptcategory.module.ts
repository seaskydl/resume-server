import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerMiddleware } from "common/middlewares/logger.middleware";
import { PPTcategoryController } from "./pptcategory.controller";
import { PPTcategoryService } from "./pptcategory.service";
import { PPTcategorySchema } from "./schemas/pptcategory.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "PPTcategory", schema: PPTcategorySchema },
    ]),
  ],
  controllers: [PPTcategoryController],
  providers: [PPTcategoryService],
})
export class PPTcategoryModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .exclude(
      //   { path: 'example', method: RequestMethod.GET },
      // )
      .forRoutes(PPTcategoryController);
  }
}
