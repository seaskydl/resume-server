import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { getUuid } from "common/utils/common";
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
      userResumeDto.USER = req.user.name;
      userResumeDto.EMAIL = req.user.email;
      console.log("userResumeDto.USER", userResumeDto.USER);
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

  @ApiOperation({ summary: "查询个人简历列表" })
  @Get("templateList")
  @UseGuards(RolesGuard)
  @Roles("User")
  async getUserResumeList(@Query() params, @Req() req): Promise<IResponse> {
    try {
      let query = {
        EMAIL: req.user.email,
        page: Number(params.page) || 1,
        limit: Number(params.limit) || 6,
        IS_ONLINE: params.isOnline || false,
      };
      let resume = await this.userresumeService.getUserResumeByEmail(query);
      if (resume) {
        return new ResponseSuccess("查询成功", resume);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "删除用户简历" })
  @Delete("deleteResume/:id")
  @UseGuards(RolesGuard)
  @Roles("User")
  async ddeleteUserResume(@Param() params, @Req() req): Promise<IResponse> {
    try {
      let ID = params.id;
      let email = req.user.email;
      if (!ID || !email) {
        return new ResponseError("参数错误", null);
      }
      let resume = await this.userresumeService.deleteUserResumeByEmailAndId(
        ID,
        email
      );
      if (resume) {
        return new ResponseSuccess("删除成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "管理员查询用户简历列表" })
  @Get("getAllUserResumeList")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async getAllUserResumeList(@Query() query): Promise<IResponse> {
    try {
      let resumeList = await this.userresumeService.getAllUserResumeList(query);
      if (resumeList) {
        return new ResponseSuccess("查询成功", resumeList);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "管理员删除用户简历" })
  @Delete("deleteUserResume")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async deleteUserResume(@Query() query): Promise<IResponse> {
    try {
      let EMAIL = query.EMAIL;
      let ID = query.ID;
      let userResume = await this.userresumeService.deleteUserResumeByAdmin(
        EMAIL,
        ID
      );
      if (userResume) {
        return new ResponseSuccess("删除成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "发布为在线简历" })
  @Post("publishOnline")
  @UseGuards(RolesGuard)
  @Roles("User")
  async publishOnline(@Body() body): Promise<IResponse> {
    try {
      let email = body.email;
      let ID = body.ID;
      let ONLINE_LINK = getUuid();
      console.log("email", email, ID);
      let userResume: any = await this.userresumeService.publishOnline(
        email,
        ID,
        ONLINE_LINK
      );
      if (userResume) {
        let responseData = {
          ONLINE_LINK: userResume.ONLINE_LINK,
          IS_ONLINE: userResume.IS_ONLINE,
        };
        return new ResponseSuccess("发布成功", responseData);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "更新在线简历设置" })
  @Put("updateOnlineResume")
  @UseGuards(RolesGuard)
  @Roles("User")
  async updateOnlineResume(@Body() body, @Req() req): Promise<IResponse> {
    try {
      let params = {
        email: req.user.email,
        isOnline: body.isOnline,
        onlineLink: body.onlineLink,
        ID: body.ID,
      };
      let userResume = await this.userresumeService.updateOnlineResume(params);
      if (userResume) {
        return new ResponseSuccess("更新成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }
}
