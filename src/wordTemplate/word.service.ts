import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import pageQuery from "common/utils/pageQuery";
import { Model } from "mongoose";
import { Word } from "./interfaces/word.interface";

@Injectable()
export class WordService {
  constructor(@InjectModel("Word") private readonly wordModel: Model<Word>) {}

  // 新增模板
  async wordAdd(params: any): Promise<any> {
    console.log("word params", params);
    let newWord = new this.wordModel(params);
    return await newWord.save();
  }

  // 查询模板列表
  async wordList(query: any) {
    return new Promise(async (resolve, reject) => {
      let page = Number(query.page); // 查询页码
      let limit = Number(query.limit); // 查询条数
      pageQuery(page, limit, this.wordModel, "", {}, {}, function(
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
  async deleteWord(id: string) {
    let word = await this.wordModel.findById({ _id: id });
    if (!word) {
      throw new HttpException("模板不存在", HttpStatus.NOT_FOUND);
    }
    return await this.wordModel.deleteOne({ _id: id });
  }

  // 更新模板
  async updateWord(body: any) {
    let word = await this.wordModel.findById({ _id: body.id });
    if (!word) {
      throw new HttpException("模板不存在", HttpStatus.NOT_FOUND);
    }
    return await this.wordModel.findByIdAndUpdate(
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
  async wordDownloadUrl(id: string, email: string) {
    await this.wordModel.findOneAndUpdate(
      { _id: id },
      { $inc: { downloads: 1 } }
    ); // 下载量+1

    let word = await this.wordModel.findOne({ _id: id });
    if (!word) {
      throw new HttpException("模板不存在", HttpStatus.NOT_FOUND);
    } else {
      // 判断是否支付，支付则可以继续执行

      // 添加下载用户
      await this.wordModel.findOneAndUpdate(
        { _id: id },
        {
          $addToSet: { downloads_users: email },
        },
        { upsert: true, new: true }
      );
      console.log("下载用户添加成功");

      // 返回文件下载地址
      return {
        fileUrl: word.fileUrl,
      };
    }
  }
}
