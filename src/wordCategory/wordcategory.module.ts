import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerMiddleware } from "common/middlewares/logger.middleware";
import { WordcategorySchema } from "./schemas/wordcategory.schema";
import { WordcategoryController } from "./wordcategory.controller";
import { WordcategoryService } from "./wordcategory.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Wordcategory", schema: WordcategorySchema },
    ]),
  ],
  controllers: [WordcategoryController],
  providers: [WordcategoryService],
})
export class WordcategoryModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .exclude(
      //   { path: 'example', method: RequestMethod.GET },
      // )
      .forRoutes(WordcategoryController);
  }
}
