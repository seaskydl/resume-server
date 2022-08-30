export class GlobalStyleDto {
  constructor(object: any = {}) {
    this.themeColor = object.themeColor;
    this.firstTitleFontSize = object.firstTitleFontSize;
    this.secondTitleFontSize = object.secondTitleFontSize;
    this.textFontSize = object.textFontSize;
    this.secondTitleColor = object.secondTitleColor;
    this.textFontColor = object.textFontColor;
    this.secondTitleWeight = object.secondTitleWeight;
    this.textFontWeight = object.textFontWeight;
    this.pTop = object.pTop;
    this.pBottom = object.pBottom;
    this.pLeftRight = object.pLeftRight;
    this.modelMarginTop = object.modelMarginTop;
    this.modelMarginBottom = object.modelMarginBottom;
    this.leftWidth = object.leftWidth;
    this.rightWidth = object.rightWidth;
    this.leftThemeColor = object.leftThemeColor;
    this.rightThemeColor = object.rightThemeColor;
  }
  themeColor: string; // 主题色
  firstTitleFontSize: string; // 一级标题
  secondTitleFontSize: string; // 二级标题
  textFontSize: string; // 正文
  secondTitleColor: string; // 二级标题字体颜色
  textFontColor: string; // 正文字体颜色
  secondTitleWeight: Number; // 二级标题字体粗细
  textFontWeight: Number; // 正文字体粗细
  pTop: string; // 上内边距
  pBottom: string; // 下内边距
  pLeftRight: string; // 左右内边距
  modelMarginTop: string;
  modelMarginBottom: string;
  leftWidth: string; // 左右布局时左侧宽度
  rightWidth: string; // 左右布局时右侧宽度
  leftThemeColor: string; // 左侧布局时左侧背景色
  rightThemeColor: string; // 右侧布局时右侧背景色
}
