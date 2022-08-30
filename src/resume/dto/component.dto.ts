export class ComponentDto {
  keyId: string;
  model: string;
  cptName: string; // 组件名
  cptOptionsName: string; // 组件属性设置面板名称
  cptTitle: string; // 组件名
  cptX: number; // 组件x坐标
  cptY: number; // 组件y坐标
  cptZ: number; // 组件z坐标
  cptHeight: string; // 组件高度
  cptWidth: string; // 组件宽度
  layout: string; // 布局在左侧还是右侧
  show: boolean; // 组件是否显示
  style: {
    themeColor: string; // 主题色
    firstTitleFontSize: string; // 一级标题
    textColor: string;
    textFontSize: string;
    textFontWeight: number;
    titleColor: string;
    titleFontSize: string;
    titleFontWeight: number;
    backgroundColor: string;
    pLeftRight: string; // 左右内边距
    pTop: string; // 上内边距
    pBottom: string; // 下内边距
    mBottom: string;
    mTop: string;
  };
  data: object;
  constructor(object: any) {
    this.keyId = object.keyId;
    this.model = object.model;
    this.cptName = object.cptName;
    this.cptOptionsName = object.cptOptionsName;
    this.cptTitle = object.cptTitle;
    this.cptX = object.cptX;
    this.cptY = object.cptY;
    this.cptZ = object.cptZ;
    this.cptHeight = object.cptHeight;
    this.cptWidth = object.cptWidth;
    this.layout = object.layout;
    this.show = object.show;
    this.style = {
      themeColor: object.style.themeColor, // 主题色
      firstTitleFontSize: object.style.firstTitleFontSize, // 一级标题
      textColor: object.style.textColor,
      textFontSize: object.style.textFontSize,
      textFontWeight: object.style.textFontWeight,
      titleColor: object.style.titleColor,
      titleFontSize: object.style.titleFontSize,
      titleFontWeight: object.style.titleFontWeight,
      backgroundColor: object.style.backgroundColor,
      pLeftRight: object.style.pLeftRight, // 左右内边距
      pTop: object.style.pTop, // 上内边距
      pBottom: object.style.pBottom, // 下内边距
      mBottom: object.style.mBottom,
      mTop: object.style.mTop,
    };
    this.data = object.data;
  }
}
