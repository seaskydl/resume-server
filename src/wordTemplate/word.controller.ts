import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { WordService } from "./word.service";

@ApiTags("word模板相关接口")
@Controller("wordTemplate")
@UseGuards(AuthGuard("jwt"))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @ApiOperation({ summary: "新增word模板" })
  @Post("wordAdd")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async wordAdd(@Body() body): Promise<IResponse> {
    try {
      let params = {
        name: body.name,
        profile: body.profile,
        category: body.category,
        previewUrl: body.previewUrl,
        tags: body.tags,
        fileUrl: body.fileUrl,
      };
      let word = await this.wordService.wordAdd(params);
      if (word) {
        return new ResponseSuccess("新增成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "查询word模板列表" })
  @Get("wordList")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async wordList(@Query() params): Promise<IResponse> {
    try {
      let query = {
        page: Number(params.page) || 1,
        limit: Number(params.limit) || 6,
      };
      let word = await this.wordService.wordList(query);
      if (word) {
        return new ResponseSuccess("查询成功", word);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "删除word模板" })
  @Delete("deleteWord/:id")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async deleteWord(@Param() params): Promise<IResponse> {
    try {
      let word = await this.wordService.deleteWord(params.id);
      if (word) {
        return new ResponseSuccess("删除成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "更新word模板" })
  @Put("updateWord")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async updateWord(@Body() body): Promise<IResponse> {
    try {
      let word = await this.wordService.updateWord(body);
      if (word) {
        return new ResponseSuccess("更新成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "获取word文件下载链接" })
  @Get("wordDownloadUrl/:id")
  @UseGuards(RolesGuard)
  @Roles("User")
  async wordDownloadUrl(@Param() params): Promise<IResponse> {
    try {
      let url = await this.wordService.wordDownloadUrl(params.id);
      if (url) {
        return new ResponseSuccess("获取成功", url);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }
}
