import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { default as config } from "./config";
import { ResumeModel } from "./resume/resume.module";
import { UploadModule } from "upload/upload.module";
import { UnauthModel } from "unauth/unauth.module";
import { UserresumeModule } from "userResume/userresume.module";
import { PuppeteerModule } from "puppeteer/puppeteer.module";
import { PanelModule } from "panel/panel.module";

const userString =
  config.db.user && config.db.pass
    ? config.db.user + ":" + config.db.pass + "@"
    : "";
const authSource = config.db.authSource
  ? "?authSource=" + config.db.authSource + "&w=1"
  : "";

@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb://" +
        userString +
        config.db.host +
        ":" +
        (config.db.port || "27017") +
        "/" +
        config.db.database +
        authSource
    ),
    UsersModule,
    AuthModule,
    ResumeModel,
    UploadModule,
    UnauthModel,
    UserresumeModule,
    PuppeteerModule,
    PanelModule,
  ],
  // controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
