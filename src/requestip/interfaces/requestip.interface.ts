import { Document } from "mongoose";
export interface Requestip extends Document {
  ip_address: String; // IP地址
  infocode: String;
  province: String;
  city: String;
  adcode: String;
  rectangle: String;
}
