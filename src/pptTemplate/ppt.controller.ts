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
import { PPTService } from "./ppt.service";

@ApiTags("word模板相关接口")
@Controller("pptTemplate")
@UseGuards(AuthGuard("jwt"))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class PPTController {
  constructor(private readonly pptService: PPTService) {}

  @ApiOperation({ summary: "新增ppt模板" })
  @Post("pptAdd")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async pptAdd(@Body() body): Promise<IResponse> {
    try {
      let params = {
        name: body.name,
        profile: body.profile,
        category: body.category,
        previewUrl: body.previewUrl,
        tags: body.tags,
        fileUrl: body.fileUrl,
        effect: body.effect, // 效果
        proportion: body.proportion, // 比列
        pages: body.pages, // 总页数
      };
      let ppt = await this.pptService.pptAdd(params);
      if (ppt) {
        return new ResponseSuccess("新增成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "查询ppt模板列表" })
  @Get("pptList")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async wordList(@Query() params): Promise<IResponse> {
    try {
      let query = {
        page: Number(params.page) || 1,
        limit: Number(params.limit) || 6,
      };
      let ppt = await this.pptService.pptList(query);
      if (ppt) {
        return new ResponseSuccess("查询成功", ppt);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "删除ppt模板" })
  @Delete("deletePPT/:id")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async deleteWord(@Param() params): Promise<IResponse> {
    try {
      let ppt = await this.pptService.deletePPT(params.id);
      if (ppt) {
        return new ResponseSuccess("删除成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "更新ppt模板" })
  @Put("updatePPT")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async updatePPT(@Body() body): Promise<IResponse> {
    try {
      let ppt = await this.pptService.updatePPT(body);
      if (ppt) {
        return new ResponseSuccess("更新成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "获取ppt文件下载链接" })
  @Get("pptDownloadUrl/:id")
  @UseGuards(RolesGuard)
  @Roles("User")
  async pptDownloadUrl(@Param() params, @Req() req): Promise<IResponse> {
    try {
      let email = req.user.email;

      let url = await this.pptService.pptDownloadUrl(params.id, email);
      if (url) {
        return new ResponseSuccess("获取成功", url);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }
}
