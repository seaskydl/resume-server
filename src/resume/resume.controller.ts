import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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

  @ApiOperation({ summary: "查询简历模板数据" })
  @Get("template/:id")
  @UseGuards(RolesGuard)
  @Roles("User")
  async getTemplateJsonById(@Param() params): Promise<IResponse> {
    try {
      let resume = await this.resumeService.findResumeById(params.id);
      return new ResponseSuccess("请求成功", new ResumeDto(resume));
    } catch (error) {
      return new ResponseError(error, "查询模板数据失败");
    }
  }

  @ApiOperation({ summary: "增加模板" })
  @Post("addTemplate")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async addTemplateJson(@Body() ResumeDto: ResumeDto): Promise<IResponse> {
    try {
      var newTemplate = await this.resumeService.addTemplate(ResumeDto);
      if(newTemplate){
        return new ResponseSuccess("模板添加成功");
      } else {
        return new ResponseError('模板添加失败', null);
      }
    } catch(error){
      return new ResponseError(error.message, null, error.status);
    }
  }
}