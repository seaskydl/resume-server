import { Document } from "mongoose";
export interface Sponsor extends Document {
  email: string;
  link: string;
  logo_url: string;
  name: string;
  sponsor_img: string;
  vx: string;
  vaild: boolean;
}
