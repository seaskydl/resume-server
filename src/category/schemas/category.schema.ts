import * as mongoose from "mongoose";

export const CategorySchema = new mongoose.Schema(
  {
    category_value: String, // 分类值
    category_label: String, // 分类名称
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);
