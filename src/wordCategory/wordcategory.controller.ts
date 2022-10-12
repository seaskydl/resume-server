import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
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
import { WordcategoryService } from "./wordcategory.service";

@ApiTags("word模板相关接口")
@Controller("word")
@UseGuards(AuthGuard("jwt"))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class WordcategoryController {
  constructor(private readonly wordcategoryService: WordcategoryService) {}

  @ApiOperation({ summary: "新增word分类" })
  @Post("wordCategoryAdd")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async wordCategoryAdd(@Body() body): Promise<IResponse> {
    try {
      let params = {
        name: body.name,
      };
      let word = await this.wordcategoryService.wordCategoryAdd(params);
      if (word) {
        return new ResponseSuccess("新增成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "修改word分类" })
  @Put("wordCategoryUpdate")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async wordCategoryUpdate(@Body() body): Promise<IResponse> {
    try {
      console.log(body);
      let param = {
        _id: body.id,
        name: body.name,
      };
      let category = await this.wordcategoryService.wordCategoryUpdate(param);
      if (category) {
        return new ResponseSuccess("修改成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "删除word分类" })
  @Delete("wordCategoryDelete/:id")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async wordCategoryDelete(@Param() params): Promise<IResponse> {
    try {
      let param = {
        _id: params.id,
      };
      let category = await this.wordcategoryService.wordCategoryDelete(param);
      if (category) {
        return new ResponseSuccess("删除成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }
}
