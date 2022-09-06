import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerMiddleware } from "common/middlewares/logger.middleware";
import { UserresumeSchema } from "./schemas/userresume.schema";
import { UserresumeController } from "./userresume.controller";
import { UserresumeService } from "./userresume.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Userresume", schema: UserresumeSchema },
    ]),
  ],
  controllers: [UserresumeController],
  providers: [UserresumeService],
})
export class UserresumeModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .exclude(
      //   { path: 'example', method: RequestMethod.GET },
      // )
      .forRoutes(UserresumeController);
  }
}
