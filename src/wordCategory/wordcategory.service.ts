import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Wordcategory } from "./interface/wordcategory.interface";

@Injectable()
export class WordcategoryService {
  constructor(
    @InjectModel("Wordcategory")
    private readonly wordcategoryModel: Model<Wordcategory>
  ) {}

  // 新增分类
  async wordCategoryAdd(params: any): Promise<any> {
    let newCategory = new this.wordcategoryModel(params);
    return await newCategory.save();
  }

  // 修改分类
  async wordCategoryUpdate(params: any) {
    console.log("params", params);
    return await this.wordcategoryModel.findByIdAndUpdate(
      params._id,
      {
        $set: {
          name: params.name,
        },
      },
      { upsert: true }
    );
  }

  // 删除分类
  async wordCategoryDelete(params: any) {
    let category = await this.wordcategoryModel.findById({ _id: params._id });
    if (!category) {
      throw new HttpException("分类不存在", HttpStatus.NOT_FOUND);
    }
    return await this.wordcategoryModel.deleteOne({ _id: params._id });
  }
}
