import * as mongoose from "mongoose";
export const WordSchema = new mongoose.Schema(
  {
    name: String, // word模板名称
    profile: String, // 模板简介
    category: Array, // 模板分类
    previewUrl: String, // 模板预览图
    fileUrl: String, // 文件地址
    tags: Array,  // 模板标签
    likes: {
      type: Number,
      default: 0,
    }, // 点赞量
    views: {
      type: Number,
      default: 0,
    }, // 浏览量
    collections: {
      type: Number,
      default: 0,
    }, // 收藏量
    downloads: {
      type: Number,
      default: 0,
    }, // 下载量
    likes_users: Array, // 浏览用户
    views_users: Array, // 浏览用户
    collections_users: Array, // 收藏用户
    downloads_users: Array, // 下载用户
    pay_users: Array, // 支付了的用户
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);
