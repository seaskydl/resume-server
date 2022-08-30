import { Document } from "mongoose";
export interface Resume extends Document {
  ID: string;
  NAME: string;
  TITLE: string;
  LAYOUT: string;
  COMPONENTS: Array<{
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
    data: any;
  }>;
  GLOBAL_STYLE: {
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
  };
}
