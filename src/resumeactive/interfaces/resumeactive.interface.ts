import { Document } from "mongoose";
export interface Resumeactive extends Document {
  ID: string; // 简历ID
  view_users_email: Array<string>; //  简历浏览用户list
  like_users_email: Array<string>; // 简历点赞用户list
}
