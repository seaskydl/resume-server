import * as mongoose from "mongoose";

export const ResumeSchema = new mongoose.Schema(
  {
    USER: String, // 模板创建人
    EMAIL: String, // 创建人邮箱
    previewUrl: String, // 模板预览图链接
    ID: String,
    NAME: String,
    TITLE: String,
    LAYOUT: String,
    COMPONENTS: Array,
    CATEGORY: Array, // 简历风格
    PASS_AUDIT: {
      type: Number,
      default: 3,
    }, // 是否通过审核 1-同意  2-拒绝  3-待审核
    GLOBAL_STYLE: {
      themeColor: String, // 主题色
      firstTitleFontSize: String, // 一级标题
      secondTitleFontSize: String, // 二级标题
      textFontSize: String, // 正文
      secondTitleColor: String, // 二级标题字体颜色
      textFontColor: String, // 正文字体颜色
      secondTitleWeight: Number, // 二级标题字体粗细
      textFontWeight: Number, // 正文字体粗细
      pTop: String, // 上内边距
      pBottom: String, // 下内边距
      pLeftRight: String, // 左右内边距
      modelMarginTop: String,
      modelMarginBottom: String,
      leftWidth: String, // 左右布局时左侧宽度
      rightWidth: String, // 左右布局时右侧宽度
      leftThemeColor: String, // 左侧布局时左侧背景色
      rightThemeColor: String, // 右侧布局时右侧背景色
    },
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);
