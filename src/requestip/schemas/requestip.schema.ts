import * as mongoose from "mongoose";

export const RequestipSchema = new mongoose.Schema(
  {
    ip_address: '', // 访问IP地址
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);
