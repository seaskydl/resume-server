import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "users/schemas/user.schema";
import { LoggerMiddleware } from "../common/middlewares/logger.middleware";
import { PanelController } from "./panel.controller";
import { PanelService } from "./panel.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
  controllers: [PanelController],
  providers: [PanelService],
})
export class PanelModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .exclude(
      //   { path: 'example', method: RequestMethod.GET },
      // )
      .forRoutes(PanelController);
  }
}
