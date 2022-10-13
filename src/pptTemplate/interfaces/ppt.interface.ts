export interface PPT extends Document {
  name: String; // word模板名称
  profile: String; // 模板简介
  category: String; // 模板分类
  previewUrl: String; // 模板预览图
  fileUrl: String; // 文件地址
  tags: Array<string>; // 模板标签
  effect: String; // 效果
  proportion: String; // 比列
  pages: Number; // 总页数
  likes: Number; // 点赞量
  views: Number; // 浏览量
  collections: Number; // 收藏量
  downloads: Number; // 下载量
  likes_users: Array<string>; // 浏览用户
  views_users: Array<string>; // 浏览用户
  collections_users: Array<string>; // 收藏用户
  downloads_users: Array<string>; // 下载用户
}
