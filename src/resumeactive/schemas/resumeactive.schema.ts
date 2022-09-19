import * as mongoose from "mongoose";

export const ResumeactiveSchema = new mongoose.Schema(
  {
    ID: String, // 简历ID
    view_users_email: Array, //  简历浏览用户list
    like_users_email: Array, // 简历点赞用户list
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);