import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Resume } from "./interfaces/resume.interface";
import { Model } from "mongoose";
import { ResumeDto } from "./dto/resume.dto";

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
}
