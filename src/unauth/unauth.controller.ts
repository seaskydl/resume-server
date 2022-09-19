import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
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
  async getTemplateList(@Query() query): Promise<IResponse> {
    try {
      let templateList: any = await this.unauthService.getTemplateList(query);
      if (templateList) {
        return new ResponseSuccess("查询成功", templateList);
      } else {
        return new ResponseError("查询失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "提交赞助信息" })
  @Post("addSponsor")
  async addSponsor(@Body() sponsorData): Promise<IResponse> {
    try {
      let sponsor = await this.unauthService.addSponsor(sponsorData);
      if (sponsor) {
        return new ResponseSuccess("新增成功", sponsor);
      } else {
        return new ResponseError("新增失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "查询赞助列表" })
  @Get("getSponsorList")
  async getSponsorList(@Query() query): Promise<IResponse> {
    try {
      let sponsorList = await this.unauthService.getSponsorList(query);
      if (sponsorList) {
        return new ResponseSuccess("查询成功", sponsorList);
      } else {
        return new ResponseError("查询失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "查询简历分类列表" })
  @Get("getCategoryList")
  async getCategoryList(): Promise<IResponse> {
    try {
      let categoryList = await this.unauthService.getCategoryList();
      if (categoryList) {
        return new ResponseSuccess("查询成功", categoryList);
      } else {
        return new ResponseError("查询失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }
}
