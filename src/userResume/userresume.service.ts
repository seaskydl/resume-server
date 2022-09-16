import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { getNowDate } from "common/utils/date";
import pageQuery from "common/utils/pageQuery";
import { Model } from "mongoose";
import { Resume } from "resume/interfaces/resume.interface";
import { UserResumeDto } from "./dto/userresume.dto";

@Injectable()
export class UserresumeService {
  constructor(
    @InjectModel("Userresume") private readonly userresumeModel: Model<Resume>
  ) {}

  // 更新或者添加简历数据
  async updateUserResumeByEmail(userResumeDto: UserResumeDto) {
    let updateUserResumeModel = await this.userresumeModel.findOneAndUpdate(
      { EMAIL: userResumeDto.EMAIL, ID: userResumeDto.ID },
      userResumeDto,
      { upsert: true, new: true }
    );
    if (updateUserResumeModel) {
      return "更新成功";
    } else {
      throw new HttpException("更新失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 根据邮箱和id查询单个简历
  async getUserResumeByEmailAndId(query: { EMAIL: string; ID: string }) {
    let resume = await this.userresumeModel
      .findOne({ ID: query.ID, EMAIL: query.EMAIL })
      .exec();
    if (resume) {
      return resume;
    } else {
      throw new HttpException("查询失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 根据邮箱和id删除用户简历
  async deleteUserResumeByEmailAndId(ID: string, email: string) {
    let resume = await this.userresumeModel
      .findOneAndDelete({ ID: ID, EMAIL: email })
      .exec();
    if (resume) {
      return resume;
    } else {
      throw new HttpException("删除失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 查询简历列表
  async getUserResumeByEmail(query: {
    EMAIL: string;
    page: number;
    limit: number;
  }) {
    return new Promise(async (resolve, reject) => {
      let page = Number(query.page); // 查询页码
      let limit = Number(query.limit); // 查询条数
      pageQuery(
        page,
        limit,
        this.userresumeModel,
        "",
        {
          EMAIL: query.EMAIL,
        },
        {},
        function(error, $page) {
          if (error) {
            reject(error);
          } else {
            let list = $page.results.map((item) => {
              return {
                ID: item.ID,
                previewUrl: item.previewUrl,
                NAME: item.NAME,
              };
            });
            let responseData = {
              page: {
                currentPage: $page.pageNumber,
                pageCount: $page.pageCount,
                count: $page.count,
                isEnd: $page.isEnd,
              },
              list: list,
            };
            resolve(responseData);
          }
        }
      );
    });
  }
}
