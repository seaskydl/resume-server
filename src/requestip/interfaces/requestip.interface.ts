import { Document } from "mongoose";
export interface Requestip extends Document {
  ip_address: String; // IP地址
}
