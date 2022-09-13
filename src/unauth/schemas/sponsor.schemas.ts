import * as mongoose from "mongoose";

export const SponsorSchema = new mongoose.Schema(
  {
    email: String,
    link: String,
    logo_url: String,
    name: String,
    sponsor_img: String,
    vx: String,
    vaild: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);
