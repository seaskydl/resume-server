import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "common/decorators/roles.decorator";
import { ResponseError, ResponseSuccess } from "common/dto/response.dto";
import { RolesGuard } from "common/guards/roles.guard";
import { LoggingInterceptor } from "common/interceptors/logging.interceptor";
import { TransformInterceptor } from "common/interceptors/transform.interceptor";
import { IResponse } from "common/interfaces/response.interface";
import { UploadService } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import multer = require("multer");
const path = require("path");
const fullPath = path.resolve("./src/uploads");

@ApiTags("用户相关接口")
@Controller("upload")
@UseGuards(AuthGuard("jwt"))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: "上传文件" })
  @Post("file/:path")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: multer.diskStorage({
        //设置文件存储路径
        destination: (req, file, cb) => {
          cb(null, fullPath);
        },
        //设置文件存储名称
        filename: (req, file, cb) => {
          let extname = path.extname(file.originalname);
          // 解决中文名乱码的问题
          file.originalname = Buffer.from(file.originalname, "latin1").toString(
            "utf8"
          );
          let fileName = file.originalname
            .substring(0, file.originalname.lastIndexOf("."))
            .toString("utf8");

          let filename = fileName + "-" + Date.now() + extname;
          cb(null, filename);
        },
      }),
    })
  )
  @UseGuards(RolesGuard)
  @Roles("User", "Admin")
  async findById(
    @UploadedFile() file,
    @Req() req,
    @Param() params
  ): Promise<IResponse> {
    try {
      // console.log(file, req);
      var uploadData = await this.uploadService.upload(req, params.path);
      return new ResponseSuccess("上传成功", uploadData);
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }
}
