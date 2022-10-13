import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Resume } from "../resume/interfaces/resume.interface";
import { Model } from "mongoose";
import { QueryDto } from "../resume/dto/query.dto";
import pageQuery from "common/utils/pageQuery";
import { Sponsor } from "./interfaces/sponsor.interface";
import { Category } from "category/interface/category.interface";
import { User } from "users/interfaces/user.interface";
import { Requestip } from "requestip/interfaces/requestip.interface";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { default as config } from "../config";
import { Wordcategory } from "wordCategory/interface/wordcategory.interface";
import { Word } from "wordTemplate/interfaces/word.interface";
import { PPTcategory } from "pptCategory/interface/pptcategory.interface";
import { PPT } from "pptTemplate/interfaces/ppt.interface";

@Injectable()
export class UnauthService {
  constructor(
    @InjectModel("Resume") private readonly resumeModel: Model<Resume>,
    @InjectModel("Sponsor") private readonly sponsorModel: Model<Sponsor>,
    @InjectModel("Category") private readonly CategoryModel: Model<Category>,
    @InjectModel("Userresume") private readonly userresumeModel: Model<Resume>,
    @InjectModel("Requestip") private readonly requestipModel: Model<Requestip>,
    @InjectModel("Word") private readonly wordModel: Model<Word>,
    @InjectModel("Wordcategory")
    private readonly wordcategoryModel: Model<Wordcategory>,
    @InjectModel("PPTcategory")
    private readonly pptcategoryModel: Model<PPTcategory>,
    @InjectModel("PPT") private readonly pptModel: Model<PPT>,
    @InjectModel("User")
    private readonly userModel: Model<User>,
    private httpService: HttpService
  ) {}

  // 查询模板列表-不查出详细数据
  async getTemplateList(queryDto) {
    return new Promise(async (resolve, reject) => {
      let page = Number(queryDto.page) || 1; // 查询页码
      let limit = Number(queryDto.limit) || 10; // 查询条数
      let sort;
      // 排序规则
      if (queryDto.sort) {
        if (queryDto.sort === "time") {
          sort = {
            createDate: -1,
          };
        } else {
          sort = {
            VIEWS: -1,
          };
        }
      } else {
        sort = {
          VIEWS: -1,
        };
      }
      // 查询条件
      let queryParams;
      if (queryDto.category) {
        queryParams = {
          CATEGORY: { $elemMatch: { $eq: queryDto.category } },
        };
      } else {
        queryParams = {};
      }
      queryParams.PASS_AUDIT = 1;
      console.log("查询参数", page, limit);
      pageQuery(
        page,
        limit,
        this.resumeModel,
        "",
        queryParams,
        sort,
        async (error, $page) => {
          if (error) {
            reject(error);
          } else {
            let list = $page.results.map((item) => {
              return {
                ID: item.ID,
                previewUrl: item.previewUrl,
                NAME: item.NAME,
                EMAIL: item.EMAIL,
                LIKES: item.like_users_email.length,
                VIEWS: item.view_users_email.length,
              };
            });
            // 在查询模板的相关浏览记录、用户基本信息
            for (let i = 0; i < list.length; i++) {
              // 用户信息等
              let user = await this.userModel
                .findOne({
                  email: list[i].EMAIL,
                })
                .exec();
              if (user) {
                list[i].userInfo = {
                  name: user.name,
                  userId: user._id,
                  avatar: user.photos.profilePic
                    ? user.photos.profilePic.url
                    : "",
                };
              } else {
                list[i].userInfo = null;
              }
            }
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

  // 查询word模板列表，不查出详细数据
  async getWordTemplateList(queryDto) {
    return new Promise(async (resolve, reject) => {
      let page = Number(queryDto.page) || 1; // 查询页码
      let limit = Number(queryDto.limit) || 10; // 查询条数
      let sort;
      // 排序规则
      if (queryDto.sort) {
        if (queryDto.sort === "time") {
          sort = {
            createDate: -1,
          };
        } else {
          sort = {
            views: -1,
          };
        }
      } else {
        sort = {
          views: -1,
        };
      }
      // 查询条件
      let queryParams;
      if (queryDto.category && queryDto.tag) {
        queryParams = {
          category: { $elemMatch: { $eq: queryDto.category } },
          tags: { $elemMatch: { $eq: queryDto.tag } },
        };
      } else if (queryDto.category) {
        queryParams = {
          category: { $elemMatch: { $eq: queryDto.category } },
        };
      } else if (queryDto.tag) {
        queryParams = {
          tags: { $elemMatch: { $eq: queryDto.tag } },
        };
      } else {
        queryParams = {};
      }
      queryParams.PASS_AUDIT = 1;
      console.log("查询参数", page, limit);
      pageQuery(
        page,
        limit,
        this.wordModel,
        "",
        queryParams,
        sort,
        async (error, $page) => {
          if (error) {
            reject(error);
          } else {
            let list = $page.results.map((item) => {
              return {
                _id: item._id,
                name: item.name, // word模板名称
                profile: item.profile, // 模板简介
                category: item.category, // 模板分类
                previewUrl: item.previewUrl, // 模板预览图
                tags: item.tags, // 模板标签
                likes: item.likes,
                views: item.views,
                collections: item.collections,
                downloads: item.downloads,
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

  // 查询ppt模板列表，不查出详细数据
  async getPPTTemplateList(queryDto) {
    return new Promise(async (resolve, reject) => {
      let page = Number(queryDto.page) || 1; // 查询页码
      let limit = Number(queryDto.limit) || 10; // 查询条数
      let sort;
      // 排序规则
      if (queryDto.sort) {
        if (queryDto.sort === "time") {
          sort = {
            createDate: -1,
          };
        } else {
          sort = {
            views: -1,
          };
        }
      } else {
        sort = {
          views: -1,
        };
      }
      // 查询条件
      let queryParams;
      if (queryDto.category && queryDto.tag) {
        queryParams = {
          category: { $elemMatch: { $eq: queryDto.category } },
          tags: { $elemMatch: { $eq: queryDto.tag } },
        };
      } else if (queryDto.category) {
        queryParams = {
          category: { $elemMatch: { $eq: queryDto.category } },
        };
      } else if (queryDto.tag) {
        queryParams = {
          tags: { $elemMatch: { $eq: queryDto.tag } },
        };
      } else {
        queryParams = {};
      }
      queryParams.PASS_AUDIT = 1;
      console.log("查询参数", page, limit);
      pageQuery(
        page,
        limit,
        this.pptModel,
        "",
        queryParams,
        sort,
        async (error, $page) => {
          if (error) {
            reject(error);
          } else {
            let list = $page.results.map((item) => {
              return {
                _id: item._id,
                name: item.name, // word模板名称
                profile: item.profile, // 模板简介
                category: item.category, // 模板分类
                previewUrl: item.previewUrl, // 模板预览图
                tags: item.tags, // 模板标签
                likes: item.likes,
                views: item.views,
                collections: item.collections,
                downloads: item.downloads,
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

  // 查询单个word模板数据，不带下载链接
  async getWordTemplateInfo(id: string) {
    // 浏览量加1
    console.log("模板浏览量加1", id);

    await this.wordModel.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } });
    let wordInfo = await this.wordModel.findById(id);
    if (wordInfo) {
      return {
        _id: wordInfo._id,
        name: wordInfo.name, // word模板名称
        profile: wordInfo.profile, // 模板简介
        category: wordInfo.category, // 模板分类
        previewUrl: wordInfo.previewUrl, // 模板预览图
        tags: wordInfo.tags, // 模板标签
        likes: wordInfo.likes,
        views: wordInfo.views,
        collections: wordInfo.collections,
        downloads: wordInfo.downloads,
      };
    } else {
      throw new HttpException("模板不存在", HttpStatus.NOT_FOUND);
    }
  }

  // 查询单个ppt模板数据，不带下载链接
  async getPPTTemplateInfo(id: string) {
    // 浏览量加1
    console.log("模板浏览量加1", id);

    await this.pptModel.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } });
    let pptInfo = await this.pptModel.findById(id);
    if (pptInfo) {
      return {
        _id: pptInfo._id,
        name: pptInfo.name, // word模板名称
        profile: pptInfo.profile, // 模板简介
        category: pptInfo.category, // 模板分类
        previewUrl: pptInfo.previewUrl, // 模板预览图
        tags: pptInfo.tags, // 模板标签
        effect: pptInfo.effect, // 效果
        proportion: pptInfo.proportion, // 比列
        pages: pptInfo.pages, // 总页数
        likes: pptInfo.likes,
        views: pptInfo.views,
        collections: pptInfo.collections,
        downloads: pptInfo.downloads,
      };
    } else {
      throw new HttpException("模板不存在", HttpStatus.NOT_FOUND);
    }
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

  // 获取网站统计数据
  async getWebAnalycData(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const usernumber = await this.userModel.find().count(); // 用户数
      const resumenumber = await this.userresumeModel.find().count(); // 制作简历数
      const trafficnumber = await this.requestipModel.find().count(); // 网站累计访问人数
      if (usernumber) {
        let webData = {
          usernumber: usernumber,
          resumenumber: resumenumber,
          trafficnumber: trafficnumber,
        };
        resolve(webData);
      } else {
        reject(null);
      }
    });
  }

  // 保存用户访问ip
  async saveRequestip(ip: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // 查询IP详细地址
      const data = await lastValueFrom(
        this.httpService.get(
          `https://restapi.amap.com/v3/ip?key=${config.gaod.key}&ip=${ip}`
        )
      );
      console.log("data", data.data);
      let requestip = await this.requestipModel.findOneAndUpdate(
        { ip_address: ip },
        {
          ip_address: ip,
          infocode: data.data.infocode.toString(),
          province: data.data.province.toString(),
          city: data.data.city.toString(),
          adcode: data.data.adcode.toString(),
          rectangle: data.data.rectangle.toString(),
        },
        { upsert: true, new: true }
      );
      if (requestip) {
        resolve(requestip);
      } else {
        reject(null);
      }
    });
  }

  // 根据id查询在线简历数据
  getOnlineResume(id: string) {
    const resume = this.userresumeModel.findOne({
      ONLINE_LINK: id,
      IS_ONLINE: true,
    });
    if (resume) {
      return resume;
    } else {
      throw new HttpException("简历不存在", HttpStatus.FOUND);
    }
  }

  // 查询word模板分类列表
  async getWordCategoryList() {
    return await this.wordcategoryModel.find().exec();
  }

  // 查询PPT模板分类列表
  async getPPTCategoryList() {
    return await this.pptcategoryModel.find().exec();
  }

  // 查询所有word模板的标签列表
  async getWordTemplateTagsList() {
    let tagsList = new Set([]);
    let wordList = await this.wordModel.find().exec();
    if (wordList) {
      wordList.forEach((item: any) => {
        item.tags.forEach((tag: any) => {
          tagsList.add(tag);
        });
      });

      return tagsList;
    } else {
      throw new HttpException("查询标签分类失败", HttpStatus.BAD_REQUEST);
    }
  }

  // 查询所有ppt模板的标签列表
  async getPPTTemplateTagsList() {
    let tagsList = new Set([]);
    let pptList = await this.pptModel.find().exec();
    if (pptList) {
      pptList.forEach((item: any) => {
        item.tags.forEach((tag: any) => {
          tagsList.add(tag);
        });
      });
      return tagsList;
    } else {
      throw new HttpException("查询标签分类失败", HttpStatus.BAD_REQUEST);
    }
  }
}
