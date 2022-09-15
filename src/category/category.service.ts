import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category } from "./interface/category.interface";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel("Category") private readonly categoryModel: Model<Category>
  ) {}
}
