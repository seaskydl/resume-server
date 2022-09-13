import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "users/interfaces/user.interface";
const moment = require("moment");

@Injectable()
export class PanelService {
  constructor(@InjectModel("User") private readonly userModel: Model<User>) {}

  // 查询用户面板数据
  async getUserPanel(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const data = await this.userModel.find().exec();
      if (!data) {
        throw new HttpException("查询失败", HttpStatus.BAD_REQUEST);
      } else {
        // 今日新增用户
        let todayUsers = await this.userModel.find({
          createDate: {
            $gte: moment(new Date()).format("YYYY-MM-DD"),
            $lte: moment(new Date())
              .add(1, "days")
              .format("YYYY-MM-DD"),
          },
        });
        // 未验证邮箱总数
        let unVaildEamil = await this.userModel.find({
          auth: {
            email: {
              valid: false,
            },
          },
        });
        // 已验证邮箱总数
        let validEmail = await this.userModel.find({
          auth: {
            email: {
              valid: true,
            },
          },
        });
        // 本月累计新增用户
        let usersTotalMonth = await this.userModel.find({
          acreateDate: {
            $gte: moment(new Date()).format("YYYY-MM"),
            $lte: moment(new Date())
              .add(1, "months")
              .format("YYYY-MM"),
          },
        });
        let returnData = {
          usersTotal: data.length,
          todayUsers: todayUsers.length,
          unVaildEamil: unVaildEamil.length,
          usersTotalMonth: usersTotalMonth.length,
          validEmail: validEmail.length
        };
        resolve(returnData);
      }
    });
  }
}
