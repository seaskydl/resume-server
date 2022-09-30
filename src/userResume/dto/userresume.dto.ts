import { getNowDate } from "common/utils/date";
import { ComponentDto } from "../../resume/dto/component.dto";
import { GlobalStyleDto } from "../../resume/dto/globalStyle.dto";

export class UserResumeDto {
  EMAIL: string; // 创建人邮箱
  USER: String; // 简历用户昵称
  readonly previewUrl: string; // 模板预览图链接
  readonly ID: string;
  readonly NAME: string;
  readonly TITLE: string;
  readonly LAYOUT: string;
  COMPONENTS: ComponentDto[];
  GLOBAL_STYLE: GlobalStyleDto;
  CATEGORY: Array<any>; // 简历风格
  LIKES: Number;
  VIEWS: Number;
  IS_ONLINE: Boolean;
  ONLINE_LINK: String; // 在线链接路径
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
    this.CATEGORY = [];
    if (object.CATEGORY) {
      object.CATEGORY.forEach((item) => {
        this.CATEGORY.push(item);
      });
    }
    this.EMAIL = object.EMAIL;
    this.USER = object.USER;
    this.previewUrl = object.previewUrl;
    this.LIKES = object.LIKES || 0;
    this.VIEWS = object.VIEWS || 0;
    this.IS_ONLINE = object.IS_ONLINE || false;
    this.ONLINE_LINK = object.ONLINE_LINK;
  }
}
