import { getNowDate } from "common/utils/date";
import { ComponentDto } from "./component.dto";
import { GlobalStyleDto } from "./globalStyle.dto";

export class ResumeDto {
  USER: string; // 模板创建人
  EMAIL: string; // 创建人邮箱
  readonly previewUrl: string; // 模板预览图链接
  readonly ID: string;
  readonly NAME: string;
  readonly TITLE: string;
  readonly LAYOUT: string;
  COMPONENTS: ComponentDto[];
  GLOBAL_STYLE: GlobalStyleDto;
  CATEGORY: Array<string>; // 简历分类
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
    this.USER = object.USER;
    this.EMAIL = object.EMAIL;
    this.previewUrl = object.previewUrl;
    this.CATEGORY = [];
    if(object.CATEGORY) {
      object.CATEGORY.forEach((item) => {
        this.CATEGORY.push(item);
      });
    }
  }
}
