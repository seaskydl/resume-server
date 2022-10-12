import * as mongoose from "mongoose";
export const WordcategorySchema = new mongoose.Schema(
  {
    name: String, // 分类名称
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);
