import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseError, ResponseSuccess } from "common/dto/response.dto";
import { IResponse } from "common/interfaces/response.interface";
import { UnauthService } from "./unauth.service";

@ApiTags("无需权限的相关接口")
@Controller("common")
export class UnauthController {
  constructor(private readonly unauthService: UnauthService) {}

  @ApiOperation({ summary: "查询所有模板列表-不查询出详细数据" })
  @Get("getTemplateList")
  async getTemplateList(@Param() params): Promise<IResponse> {
    try {
      let templateList = await this.unauthService.getTemplateList(params);
      if (templateList) {
        return new ResponseSuccess("查询成功", templateList);
      } else {
        return new ResponseError("查询失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }
}
