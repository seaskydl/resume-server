import { Controller, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { LoggingInterceptor } from "common/interceptors/logging.interceptor";
import { TransformInterceptor } from "common/interceptors/transform.interceptor";
import { ResumeactiveService } from "./resumeactive.servive";

@ApiTags("简历模板浏览量等接口")
@Controller("resumeactive")
@UseGuards(AuthGuard("jwt"))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class ResumeactiveController {
  constructor(private readonly resumeactiveService: ResumeactiveService) {}
}