import { Document } from "mongoose";
export interface Category extends Document {
  category_value: String; // 分类id
  category_label: String; // 分类名称
}
