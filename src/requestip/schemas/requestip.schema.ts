import * as mongoose from "mongoose";

export const RequestipSchema = new mongoose.Schema(
  {
    ip_address: String, // 访问IP地址
    infocode: String,
    province: String,
    city: String,
    adcode: String,
    rectangle: String,
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);
