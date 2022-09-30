import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { getNowDate } from "common/utils/date";
import pageQuery from "common/utils/pageQuery";
import mongoose, { Model } from "mongoose";
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
    IS_ONLINE: boolean;
  }) {
    let queryParams;
    if (query.IS_ONLINE) {
      queryParams = {
        IS_ONLINE: query.IS_ONLINE,
        EMAIL: query.EMAIL,
      };
    } else {
      queryParams = {
        EMAIL: query.EMAIL,
      };
    }
    return new Promise(async (resolve, reject) => {
      let page = Number(query.page); // 查询页码
      let limit = Number(query.limit); // 查询条数
      pageQuery(
        page,
        limit,
        this.userresumeModel,
        "",
        queryParams,
        {},
        function(error, $page) {
          if (error) {
            reject(error);
          } else {
            let list = $page.results.map((item) => {
              return {
                _id: item._id,
                ID: item.ID,
                previewUrl: item.previewUrl,
                NAME: item.NAME,
                IS_ONLINE: item.IS_ONLINE,
                ONLINE_LINK: item.ONLINE_LINK || "",
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

  // 管理员查询简历列表
  async getAllUserResumeList(query) {
    return new Promise(async (resolve, reject) => {
      let page = Number(query.page) || 1; // 查询页码
      let limit = Number(query.limit) || 10; // 查询条数
      let queryParams: any = {};
      if (query.EMAIL) {
        queryParams.EMAIL = query.EMAIL;
      }
      if (query.ID) {
        queryParams.ID = query.ID;
      }
      pageQuery(
        page,
        limit,
        this.userresumeModel,
        "",
        queryParams,
        {},
        function(error, $page) {
          if (error) {
            reject(error);
          } else {
            let responseData = {
              page: {
                currentPage: $page.pageNumber,
                pageCount: $page.pageCount,
                count: $page.count,
                isEnd: $page.isEnd,
              },
              list: $page.results,
            };
            resolve(responseData);
          }
        }
      );
    });
  }

  // 管理员删除简历
  async deleteUserResumeByAdmin(EMAIL: string, ID: string) {
    let userResume = await this.userresumeModel.findOne({
      EMAIL: EMAIL,
      ID: ID,
    });
    if (!userResume) {
      throw new HttpException("简历不存在", HttpStatus.NOT_FOUND);
    }
    return await this.userresumeModel.deleteOne({ EMAIL: EMAIL, ID: ID });
  }

  // 发布为线上简历
  async publishOnline(email: string, ID: string, ONLINE_LINK: string) {
    let userresume = await this.userresumeModel.findOne({
      EMAIL: email,
      ID: ID,
    });
    if (userresume) {
      await this.userresumeModel.updateOne(
        { EMAIL: email, ID: ID },
        {
          $set: {
            IS_ONLINE: true,
            ONLINE_LINK: ONLINE_LINK,
          },
        }
      );
      return userresume;
    } else {
      throw new HttpException("该简历不存在", HttpStatus.BAD_REQUEST);
    }
  }

  // 更新线上简历设置
  async updateOnlineResume(params: any) {
    let userresume = await this.userresumeModel.findOne({
      EMAIL: params.email,
      ID: params.ID,
    });
    if (userresume) {
      return await this.userresumeModel.findOneAndUpdate(
        { EMAIL: params.email, ID: params.ID },
        {
          IS_ONLINE: params.isOnline,
          ONLINE_LINK: params.onlineLink,
        },
        { upsert: true }
      );
    } else {
      throw new HttpException("该简历不存在", HttpStatus.BAD_REQUEST);
    }
  }
}
