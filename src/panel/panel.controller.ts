import { Controller, Get, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "common/decorators/roles.decorator";
import { ResponseError, ResponseSuccess } from "common/dto/response.dto";
import { RolesGuard } from "common/guards/roles.guard";
import { LoggingInterceptor } from "common/interceptors/logging.interceptor";
import { TransformInterceptor } from "common/interceptors/transform.interceptor";
import { IResponse } from "common/interfaces/response.interface";
import { PanelService } from "./panel.service";

@ApiTags("管理面板相关接口")
@Controller("panel")
@UseGuards(AuthGuard("jwt"))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class PanelController {
  constructor(private readonly panelService: PanelService) {}

  @ApiOperation({ summary: "查询用户面板数据" })
  @Get("userPanel")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async getUserPanel(): Promise<IResponse> {
    try {
      var userData = await this.panelService.getUserPanel();
      return new ResponseSuccess("请求成功", userData);
    } catch (error) {
      return new ResponseError(error.message, null, error.status);
    }
  }
}
