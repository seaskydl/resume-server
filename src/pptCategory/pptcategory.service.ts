import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PPTcategory } from "./interface/pptcategory.interface";

@Injectable()
export class PPTcategoryService {
  constructor(
    @InjectModel("PPTcategory")
    private readonly pptcategoryModel: Model<PPTcategory>
  ) {}

  // 新增分类
  async pptCategoryAdd(params: any): Promise<any> {
    let newCategory = new this.pptcategoryModel(params);
    return await newCategory.save();
  }

  // 修改分类
  async pptCategoryUpdate(params: any) {
    console.log("params", params);
    return await this.pptcategoryModel.findByIdAndUpdate(
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
  async pptCategoryDelete(params: any) {
    let category = await this.pptcategoryModel.findById({ _id: params._id });
    if (!category) {
      throw new HttpException("分类不存在", HttpStatus.NOT_FOUND);
    }
    return await this.pptcategoryModel.deleteOne({ _id: params._id });
  }
}
