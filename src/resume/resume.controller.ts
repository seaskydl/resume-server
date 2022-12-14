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
import { ResumeDto } from "./dto/resume.dto";
import { ResumeService } from "./resume.service";

@ApiTags("简历相关接口")
@Controller("resume")
@UseGuards(AuthGuard("jwt"))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @ApiOperation({ summary: "查询简历模板数据，有草稿则返回草稿" })
  @Get("template/:id")
  @UseGuards(RolesGuard)
  @Roles("User")
  async getTemplateJsonById(@Param() params, @Req() req): Promise<IResponse> {
    try {
      // 先查询该用户是否有草稿
      let query = {
        EMAIL: req.user.email,
        ID: params.id,
      };
      // 新增浏览量
      await this.resumeService.addResumeViewers(query.ID, query.EMAIL);

      const resumeDraft = await this.resumeService.getResumeByEmailAndId(query);
      if (resumeDraft) {
        return new ResponseSuccess("请求成功", new ResumeDto(resumeDraft));
      } else {
        // 没有保存草稿则查询原始模板数据
        let resume = await this.resumeService.findResumeById(
          params.id,
          query.EMAIL
        );
        if (resume) {
          return new ResponseSuccess("请求成功", new ResumeDto(resume));
        }
      }
    } catch (error) {
      return new ResponseError(error, "查询模板数据失败");
    }
  }

  @ApiOperation({ summary: "贡献模板或者更新自己的已经贡献过的模板" })
  @Post("addTemplate")
  @UseGuards(RolesGuard)
  @Roles("User")
  async addTemplateJson(
    @Body() ResumeDto: ResumeDto,
    @Req() req
  ): Promise<IResponse> {
    try {
      ResumeDto.USER = req.user.name;
      ResumeDto.EMAIL = req.user.email;
      ResumeDto.PASS_AUDIT = 3;
      let newTemplate = await this.resumeService.addTemplate(ResumeDto);
      if (newTemplate) {
        return new ResponseSuccess("模板添加成功", null);
      } else {
        return new ResponseError("模板添加失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "更新模板" })
  @Put("updateTemplate")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async updateTemplateJson(@Body() ResumeDto: ResumeDto): Promise<IResponse> {
    try {
      console.log("请求参数", ResumeDto);
      let updateTemplate = await this.resumeService.updateTemplate(ResumeDto);
      if (updateTemplate) {
        return new ResponseSuccess("模板更新成功", null);
      } else {
        return new ResponseError("模板更新失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "删除模板" })
  @Delete("deleteTemplate/:id")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async deleteTemplateJson(@Param() params): Promise<IResponse> {
    try {
      console.log("请求参数", params);
      let deleteTemplate = await this.resumeService.deleteTemplateById(
        params.id
      );
      if (deleteTemplate) {
        return new ResponseSuccess("模板删除成功", null);
      } else {
        return new ResponseError("模板添加失败", null);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: "查询原始模板数据" })
  @Get("templateReset/:id")
  @UseGuards(RolesGuard)
  @Roles("User")
  async getResetTemplateJsonById(@Param() params): Promise<IResponse> {
    try {
      let resume = await this.resumeService.findResumeById(params.id);
      if (resume) {
        return new ResponseSuccess("请求成功", resume);
      }
    } catch (error) {
      return new ResponseError(error, "查询模板数据失败");
    }
  }

  @ApiOperation({ summary: "查询模板列表-每条都有全部数据" })
  @Get("templateListAll")
  @UseGuards(RolesGuard)
  @Roles("User")
  async getTemplateListAll(@Query() params): Promise<IResponse> {
    try {
      let query = {
        page: Number(params.page) || 1,
        limit: Number(params.limit) || 10,
        audit: params.audit || null,
      };
      let resume = await this.resumeService.getTemplateListAll(query);
      if (resume) {
        return new ResponseSuccess("请求成功", resume);
      }
    } catch (error) {
      return new ResponseError(error, "查询模板数据失败");
    }
  }

  @ApiOperation({ summary: "审核模板" })
  @Post("auditTemplate")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async auditTemplate(@Body() params): Promise<IResponse> {
    try {
      console.log("params", params.ID);
      let resume = await this.resumeService.auditTemplate(params);
      if (resume) {
        return new ResponseSuccess("审核成功", null);
      }
    } catch (error) {
      return new ResponseError(error, "审核失败");
    }
  }

  @ApiOperation({ summary: "用户查询自己贡献的模板列表" })
  @Get("getMyContributeTemplateList")
  @UseGuards(RolesGuard)
  @Roles("User")
  async getMyContributeTemplateList(@Query() params): Promise<IResponse> {
    try {
      let query = {
        page: Number(params.page) || 1,
        limit: Number(params.limit) || 10,
        email: params.email,
        audit: params.audit,
      };
      let resumeList = await this.resumeService.getMyContributeTemplateList(
        query
      );
      if (resumeList) {
        return new ResponseSuccess("查询成功", resumeList);
      }
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }
}
