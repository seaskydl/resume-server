import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import pageQuery from "common/utils/pageQuery";
import { Model } from "mongoose";
import { PPT } from "./interfaces/ppt.interface";

@Injectable()
export class PPTService {
  constructor(@InjectModel("PPT") private readonly pptModel: Model<PPT>) {}

  // 新增模板
  async pptAdd(params: any): Promise<any> {
    console.log("word params", params);
    let newWord = new this.pptModel(params);
    return await newWord.save();
  }

  // 查询模板列表
  async pptList(query: any) {
    return new Promise(async (resolve, reject) => {
      let page = Number(query.page); // 查询页码
      let limit = Number(query.limit); // 查询条数
      pageQuery(page, limit, this.pptModel, "", {}, {}, function(
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

  // 删除模板
  async deletePPT(id: string) {
    let ppt = await this.pptModel.findById({ _id: id });
    if (!ppt) {
      throw new HttpException("模板不存在", HttpStatus.NOT_FOUND);
    }
    return await this.pptModel.deleteOne({ _id: id });
  }

  // 更新模板
  async updatePPT(body: any) {
    let ppt = await this.pptModel.findById({ _id: body.id });
    if (!ppt) {
      throw new HttpException("模板不存在", HttpStatus.NOT_FOUND);
    }
    return await this.pptModel.findByIdAndUpdate(
      body.id,
      {
        $set: {
          name: body.name,
          profile: body.profile,
          category: body.category,
          previewUrl: body.previewUrl,
          fileUrl: body.fileUrl,
          tags: body.tags,
        },
      },
      { upsert: true }
    );
  }

  // 获取word文件下载链接
  async pptDownloadUrl(id: string, email: string) {
    await this.pptModel.findOneAndUpdate(
      { _id: id },
      { $inc: { downloads: 1 } }
    ); // 下载量+1

    let ppt = await this.pptModel.findOne({ _id: id });
    if (!ppt) {
      throw new HttpException("模板不存在", HttpStatus.NOT_FOUND);
    } else {
      // 判断是否支付，支付则可以继续执行

      // 添加下载用户
      await this.pptModel.findOneAndUpdate(
        { _id: id },
        {
          $addToSet: { downloads_users: email },
        },
        { upsert: true, new: true }
      );
      console.log("下载用户添加成功");

      // 返回文件下载地址
      return {
        fileUrl: ppt.fileUrl,
      };
    }
  }
}
