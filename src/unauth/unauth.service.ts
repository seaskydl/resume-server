import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Resume } from "../resume/interfaces/resume.interface";
import { Model } from "mongoose";
import { QueryDto } from "../resume/dto/query.dto";
import pageQuery from "common/utils/pageQuery";

@Injectable()
export class UnauthService {
  constructor(
    @InjectModel("Resume") private readonly resumeModel: Model<Resume>
  ) {}

  // 查询模板列表
  async getTemplateList(queryDto: QueryDto) {
    return new Promise(async (resolve, reject) => {
      let page = Number(queryDto.page) || 1; // 查询页码
      let limit = Number(queryDto.limit) || 10; // 查询条数
      console.log("查询参数", page, limit);
      pageQuery(page, limit, this.resumeModel, "", {}, {}, function(
        error,
        $page
      ) {
        if (error) {
          console.log("分页查询失败");
          reject(error);
        } else {
          let list = $page.results.map((item) => {
            return {
              ID: item.ID,
              previewUrl: item.previewUrl,
              NAME: item.NAME
            }
          })
          let responseData = {
            page: {
              currentPage: $page.pageNumber,
              pageCount: $page.pageCount,
              count: $page.count,
              isEnd: $page.isEnd,
            },
            list: list,
          };
          console.log("分页查询成功", responseData);
          resolve(responseData);
        }
      });
    });
  }
}
