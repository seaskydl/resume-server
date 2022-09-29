import { ComponentDto } from "resume/dto/component.dto";
import { GlobalStyleDto } from "resume/dto/globalStyle.dto";

export class OnlineResumeDto {
  readonly previewUrl: string; // 模板预览图链接
  readonly _id: string;
  readonly ID: string;
  readonly NAME: string;
  readonly TITLE: string;
  readonly LAYOUT: string;
  COMPONENTS: ComponentDto[];
  GLOBAL_STYLE: GlobalStyleDto;
  CATEGORY: Array<string>; // 简历分类
  PASS_AUDIT: Number;
  constructor(object: any) {
    this._id = object._id;
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
    this.CATEGORY = [];
    if (object.CATEGORY) {
      object.CATEGORY.forEach((item) => {
        this.CATEGORY.push(item);
      });
    }
  }
}
