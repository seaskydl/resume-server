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
import { PPTcategoryService } from "./pptcategory.service";

@ApiTags("ppt模板分类相关接口")
@Controller("ppt")
@UseGuards(AuthGuard("jwt"))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class PPTcategoryController {
  constructor(private readonly pptcategoryService: PPTcategoryService) {}

  @ApiOperation({ summary: "新增ppt分类" })
  @Post("pptCategoryAdd")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async pptCategoryAdd(@Body() body): Promise<IResponse> {
    try {
      let params = {
        name: body.name,
      };
      let ppt = await this.pptcategoryService.pptCategoryAdd(params);
      if (ppt) {
        return new ResponseSuccess("新增成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "修改ppt分类" })
  @Put("pptCategoryUpdate")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async pptCategoryUpdate(@Body() body): Promise<IResponse> {
    try {
      console.log(body);
      let param = {
        _id: body.id,
        name: body.name,
      };
      let category = await this.pptcategoryService.pptCategoryUpdate(param);
      if (category) {
        return new ResponseSuccess("修改成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "删除ppt分类" })
  @Delete("pptCategoryDelete/:id")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async pptCategoryDelete(@Param() params): Promise<IResponse> {
    try {
      let param = {
        _id: params.id,
      };
      let category = await this.pptcategoryService.pptCategoryDelete(param);
      if (category) {
        return new ResponseSuccess("删除成功", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }
}
