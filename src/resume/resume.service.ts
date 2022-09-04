import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Resume } from "./interfaces/resume.interface";
import { Model } from "mongoose";
import { ResumeDto } from "./dto/resume.dto";
import { QueryDto } from "./dto/query.dto";
import pageQuery from "common/utils/pageQuery";

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel("Resume") private readonly resumeModel: Model<Resume>
  ) {}

  // 查询模板数据
  async findResumeById(id: string): Promise<Resume> {
    return await this.resumeModel.findOne({ ID: id }).exec();
  }

  // 新增模板
  async addTemplate(newTemplate: ResumeDto) {
    let isHave = await this.findResumeById(newTemplate.ID);
    if (!isHave) {
      let newTem = new this.resumeModel(newTemplate);
      return await newTem.save();
    } else {
      throw new HttpException("模板ID重复", HttpStatus.FORBIDDEN);
    }
  }
  // 查询模板列表
  async getTemplateList(queryDto: QueryDto) {
    return new Promise(async (resolve, reject) => {
      let page = Number(queryDto.page) || 1; // 查询页码
      let limit = Number(queryDto.limit) || 10; // 查询条数
      pageQuery(page, limit, this.resumeModel, "", {}, {}, function(
        error,
        $page
      ) {
        if (error) {
          reject(error);
        } else {
          let list = $page.results.map((item) => {
            return {
              ID: item.id,
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
          resolve(responseData);
        }
      });
    });
  }
}
