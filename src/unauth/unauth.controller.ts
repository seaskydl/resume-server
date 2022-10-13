import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseError, ResponseSuccess } from "common/dto/response.dto";
import { IResponse } from "common/interfaces/response.interface";
import { IpAddress } from "common/requestip/getip.request";
import { OnlineResumeDto } from "./dto/onlineresme.to";
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

  @ApiOperation({ summary: "获取网站统计数据" })
  @Get("getWebAnalycData")
  async getWebAnalycData(@IpAddress() clinetIp: string): Promise<IResponse> {
    try {
      console.log("clinetIp", clinetIp);
      await this.unauthService.saveRequestip(clinetIp);
      let categoryList = await this.unauthService.getWebAnalycData();
      if (categoryList) {
        return new ResponseSuccess("查询成功", categoryList);
      } else {
        return new ResponseError("查询失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "根据id查询用户在线简历" })
  @Get("getOnlineResume/:id")
  async getOnlineResume(@Param() params): Promise<IResponse> {
    try {
      let resume = await this.unauthService.getOnlineResume(params.id);
      if (resume) {
        return new ResponseSuccess("查询成功", new OnlineResumeDto(resume));
      } else {
        return new ResponseError("查询失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "查询word模板分类列表" })
  @Get("getWordCategoryList")
  async getWordCategoryList(): Promise<IResponse> {
    try {
      let categoryList = await this.unauthService.getWordCategoryList();
      if (categoryList) {
        return new ResponseSuccess("查询成功", categoryList);
      } else {
        return new ResponseError("查询失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "查询ppt模板分类列表" })
  @Get("getPPTCategoryList")
  async getPPTCategoryList(): Promise<IResponse> {
    try {
      let categoryList = await this.unauthService.getPPTCategoryList();
      if (categoryList) {
        return new ResponseSuccess("查询成功", categoryList);
      } else {
        return new ResponseError("查询失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "查询所有word模板列表-不查询出详细数据" })
  @Get("getWordTemplateList")
  async getWordTemplateList(@Query() query): Promise<IResponse> {
    try {
      let templateList: any = await this.unauthService.getWordTemplateList(
        query
      );
      if (templateList) {
        return new ResponseSuccess("查询成功", templateList);
      } else {
        return new ResponseError("查询失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "查询所有ppt模板列表-不查询出详细数据" })
  @Get("getPPTTemplateList")
  async getPPTTemplateList(@Query() query): Promise<IResponse> {
    try {
      let templateList: any = await this.unauthService.getPPTTemplateList(
        query
      );
      if (templateList) {
        return new ResponseSuccess("查询成功", templateList);
      } else {
        return new ResponseError("查询失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "查询单个word模板数据-不带下载链接" })
  @Get("getWordTemplateInfo/:id")
  async getWordTemplateInfo(@Param() params): Promise<IResponse> {
    try {
      let wordTemplate: any = await this.unauthService.getWordTemplateInfo(
        params.id
      );
      if (wordTemplate) {
        return new ResponseSuccess("查询成功", wordTemplate);
      } else {
        return new ResponseError("查询失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "查询单个ppt模板数据-不带下载链接" })
  @Get("getPPTTemplateInfo/:id")
  async getPPTTemplateInfo(@Param() params): Promise<IResponse> {
    try {
      let pptTemplate: any = await this.unauthService.getPPTTemplateInfo(
        params.id
      );
      if (pptTemplate) {
        return new ResponseSuccess("查询成功", pptTemplate);
      } else {
        return new ResponseError("查询失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "获取word模板的所有标签列表" })
  @Get("getWordTemplateTagsList")
  async getWordTemplateTagsList(): Promise<IResponse> {
    try {
      let tagsList: any = await this.unauthService.getWordTemplateTagsList();
      if (tagsList) {
        return new ResponseSuccess("查询成功", Array.from(tagsList));
      } else {
        return new ResponseError("查询失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "获取ppt模板的所有标签列表" })
  @Get("getPPTTemplateTagsList")
  async getPPTTemplateTagsList(): Promise<IResponse> {
    try {
      let tagsList: any = await this.unauthService.getPPTTemplateTagsList();
      if (tagsList) {
        return new ResponseSuccess("查询成功", Array.from(tagsList));
      } else {
        return new ResponseError("查询失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }
}
