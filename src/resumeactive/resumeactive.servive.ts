import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Resumeactive } from "./interfaces/resumeactive.interface";

@Injectable()
export class ResumeactiveService {
  constructor(
    @InjectModel("Resumeactive")
    private readonly resumeactiveModel: Model<Resumeactive>
  ) {}

  // 给简历模板添加浏览用户
  async addResumeViewers(ID: string, email: string) {
    let updateDate = await this.resumeactiveModel.findOneAndUpdate(
      { ID: ID },
      {
        ID: ID,
        $addToSet: { view_users_email: email },
      },
      { upsert: true, new: true }
    );
    if (updateDate) {
      return updateDate;
    } else {
      throw new HttpException("浏览量添加失败", HttpStatus.BAD_REQUEST);
    }
  }

  // 查询简历模板相关浏览记录
  async getResumeActives(ID: string) {
    return new Promise(async (resolve, reject) => {
      let actives = await this.resumeactiveModel.findOne({ ID: ID }).exec();
      if (actives) {
        resolve(actives);
      } else {
        throw new HttpException("查询失败", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  }
}
