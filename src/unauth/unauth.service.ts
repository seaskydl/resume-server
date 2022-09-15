import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Resume } from "../resume/interfaces/resume.interface";
import { Model } from "mongoose";
import { QueryDto } from "../resume/dto/query.dto";
import pageQuery from "common/utils/pageQuery";
import { Sponsor } from "./interfaces/sponsor.interface";
import { Category } from "category/interface/category.interface";

@Injectable()
export class UnauthService {
  constructor(
    @InjectModel("Resume") private readonly resumeModel: Model<Resume>,
    @InjectModel("Sponsor") private readonly sponsorModel: Model<Sponsor>,
    @InjectModel("Category") private readonly CategoryModel: Model<Category>
  ) {}

  // 查询模板列表
  async getTemplateList(queryDto) {
    return new Promise(async (resolve, reject) => {
      let page = Number(queryDto.page) || 1; // 查询页码
      let limit = Number(queryDto.limit) || 10; // 查询条数
      let queryParams;
      if (queryDto.category) {
        queryParams = {
          CATEGORY: { $elemMatch: { $eq: queryDto.category } },
        };
      } else {
        queryParams = {};
      }
      console.log("查询参数", page, limit);
      pageQuery(page, limit, this.resumeModel, "", queryParams, {}, function(
        error,
        $page
      ) {
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
      });
    });
  }

  // 查询赞助列表
  async getSponsorList(queryDto: QueryDto) {
    if (queryDto.page && queryDto.limit) {
      return new Promise(async (resolve, reject) => {
        let page = Number(queryDto.page) || 1; // 查询页码
        let limit = Number(queryDto.limit) || 10; // 查询条数
        console.log("赞助列表查询参数", page, limit);
        pageQuery(page, limit, this.sponsorModel, "", {}, {}, function(
          error,
          $page
        ) {
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
        });
      });
    } else {
      return await this.sponsorModel.find().exec();
    }
  }

  // 新增赞助者
  async addSponsor(sponsorData) {
    let newSponsor = new this.sponsorModel(sponsorData);
    return await newSponsor.save();
  }

  // 查询简历分类
  async getCategoryList(): Promise<any> {
    return await this.CategoryModel.find({});
  }
}
