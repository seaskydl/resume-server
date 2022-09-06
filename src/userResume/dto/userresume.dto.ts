import { ComponentDto } from "../../resume/dto/component.dto";
import { GlobalStyleDto } from "../../resume/dto/globalStyle.dto";

export class UserResumeDto {
  EMAIL: string; // 创建人邮箱
  updateDate: Date;
  readonly previewUrl: string; // 模板预览图链接
  readonly ID: string;
  readonly NAME: string;
  readonly TITLE: string;
  readonly LAYOUT: string;
  COMPONENTS: ComponentDto[];
  GLOBAL_STYLE: GlobalStyleDto;
  constructor(object: any) {
    this.ID = object.ID;
    this.NAME = object.NAME;
    this.TITLE = object.TITLE;
    this.LAYOUT = object.LAYOUT;
    this.GLOBAL_STYLE = new GlobalStyleDto(object.GLOBAL_STYLE);
    this.COMPONENTS = [];
    if (object.COMPONENTS) {
      object.COMPONENTS.forEach((item) => {
        this.COMPONENTS.push(new ComponentDto(item));
      });
    }
    this.EMAIL = object.EMAIL;
    this.updateDate = new Date();
    this.previewUrl = object.previewUrl;
  }
}
