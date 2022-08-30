import { ComponentDto } from "./component.dto";
import { GlobalStyleDto } from "./globalStyle.dto";

export class ResumeDto {
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
  }
}
