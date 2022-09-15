import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Resume } from "./interfaces/resume.interface";
import { Model } from "mongoose";
import { ResumeDto } from "./dto/resume.dto";
import { QueryDto } from "./dto/query.dto";
import pageQuery from "common/utils/pageQuery";
import { getNowDate } from "common/utils/date";

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel("Resume") private readonly resumeModel: Model<Resume>,
    @InjectModel("Userresume") private readonly userresumeModel: Model<Resume>
  ) {}

  // 查询模板数据
  async findResumeById(id: string): Promise<Resume> {
    return await this.resumeModel.findOne({ ID: id }).exec();
  }

  // 根据邮箱和id查询单个简历
  async getResumeByEmailAndId(query: { EMAIL: string; ID: string }) {
    return new Promise(async (resolve, reject) => {
      let resume = await this.userresumeModel
        .findOne({ ID: query.ID, EMAIL: query.EMAIL })
        .exec();
      if (resume) {
        resolve(resume);
      } else {
        resolve(null);
      }
    });
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

  // 更新模板
  async updateTemplate(templateData: ResumeDto) {
    let resumeData = await this.resumeModel.findOne({ ID: templateData.ID });
    if (!resumeData) {
      throw new HttpException("模板ID不存在", HttpStatus.NOT_FOUND);
    }
    return await this.resumeModel.updateOne(
      { ID: templateData.ID },
      {
        $set: {
          USER: templateData.USER,
          EMAIL: templateData.EMAIL,
          previewUrl: templateData.previewUrl,
          NAME: templateData.NAME,
          TITLE: templateData.TITLE,
          LAYOUT: templateData.LAYOUT,
          COMPONENTS: templateData.COMPONENTS,
          GLOBAL_STYLE: templateData.GLOBAL_STYLE,
          CATEGORY: templateData.CATEGORY,
        },
      }
    );
  }

  // 删除模板
  async deleteTemplateById(ID: string) {
    let resumeData = await this.resumeModel.findOne({ ID: ID });
    if (!resumeData) {
      throw new HttpException("模板ID不存在", HttpStatus.NOT_FOUND);
    }
    return await this.resumeModel.deleteOne({ ID: ID });
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

  // 查询模板列表所有数据
  async getTemplateListAll(queryDto: QueryDto) {
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
  }
}
