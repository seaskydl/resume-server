import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerMiddleware } from "common/middlewares/logger.middleware";
import { WordSchema } from "./schemas/word.schema";
import { WordController } from "./word.controller";
import { WordService } from "./word.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Word", schema: WordSchema }]),
  ],
  controllers: [WordController],
  providers: [WordService],
})
export class WordModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .exclude(
      //   { path: 'example', method: RequestMethod.GET },
      // )
      .forRoutes(WordController);
  }
}
