import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  StreamableFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "common/decorators/roles.decorator";
import { RolesGuard } from "common/guards/roles.guard";
import { LoggingInterceptor } from "common/interceptors/logging.interceptor";
import { PaperFormat } from "puppeteer";
import { PuppeteerService } from "./puppeteer.service";

@ApiTags("导出pdf接口")
@Controller("pdf")
@UseGuards(AuthGuard("jwt"))
@UseInterceptors(LoggingInterceptor)
export class PuppeteerController {
  constructor(private readonly puppeteerService: PuppeteerService) {}

  @ApiOperation({ summary: "导出简历为PDF" })
  @Get("getPdf")
  @UseGuards(RolesGuard)
  @Roles("User")
  async pdf(
    @Query("url") url?: string,
    @Query("printBackground") printBackground?: string,
    @Query("timezone") timezone?: string,
    @Query("margin") margin?: string,
    @Query("filename") filename?: string,
    @Query("format") format?: PaperFormat
  ): Promise<StreamableFile> {
    if (!url?.match(/^https?:\/\//)) {
      throw new HttpException(`Invalid url "${url}"`, HttpStatus.BAD_REQUEST);
    }

    const buffer = await this.puppeteerService.pdf({
      url,
      printBackground: !!printBackground,
      timezone,
      margin,
      format,
    });

    return new StreamableFile(buffer, {
      type: "application/pdf",
      disposition: filename
        ? `attachement; filename="${filename}"`
        : `inline; filename="print.pdf"`,
    });
  }
}
