import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
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
import { getNowDate } from "common/utils/date";
import { UserResumeDto } from "./dto/userresume.dto";
import { UserresumeService } from "./userresume.service";

@ApiTags("用户简历相关接口")
@Controller("userresume")
@UseGuards(AuthGuard("jwt"))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UserresumeController {
  constructor(private readonly userresumeService: UserresumeService) {}

  @ApiOperation({ summary: "保存或更新用户简历" })
  @Post("template")
  @UseGuards(RolesGuard)
  @Roles("User")
  async updateUserResume(
    @Body() userResumeDto: UserResumeDto,
    @Req() req
  ): Promise<IResponse> {
    try {
      userResumeDto.EMAIL = req.user.email;
      userResumeDto.updateDate = getNowDate();
      let resume = await this.userresumeService.updateUserResumeByEmail(
        userResumeDto
      );
      if (resume) {
        return new ResponseSuccess("保存成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "查询单个简历数据" })
  @Get("template/:id")
  @UseGuards(RolesGuard)
  @Roles("User")
  async getUserResume(@Param() params, @Req() req): Promise<IResponse> {
    try {
      let query = {
        EMAIL: req.user.email,
        ID: params.id,
      };
      let resume = await this.userresumeService.getUserResumeByEmailAndId(
        query
      );
      if (resume) {
        return new ResponseSuccess("查询成功", resume);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "查询简历列表" })
  @Get("templateList")
  @UseGuards(RolesGuard)
  @Roles("User")
  async getUserResumeList(@Param() params, @Req() req): Promise<IResponse> {
    try {
      let query = {
        EMAIL: req.user.email,
        page: Number(params.page) | 1,
        limit: Number(params.limit) | 6,
      };
      console.log("query", query);
      let resume = await this.userresumeService.getUserResumeByEmail(query);
      if (resume) {
        return new ResponseSuccess("查询成功", resume);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }
}
