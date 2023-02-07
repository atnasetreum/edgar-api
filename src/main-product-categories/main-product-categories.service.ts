import { Injectable } from '@nestjs/common';
import {
  CreateMainProductCategoryDto,
  UpdateMainProductCategoryDto,
  QueryMainProductCategoryDto,
} from './dto';

@Injectable()
export class MainProductCategoriesService {
  async create(createMainProductCategoryDto: CreateMainProductCategoryDto) {
    return 'This action adds a new mainProductCategory';
  }

  findAll(query: QueryMainProductCategoryDto) {
    return `This action returns all mainProductCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mainProductCategory`;
  }

  update(
    id: number,
    updateMainProductCategoryDto: UpdateMainProductCategoryDto,
  ) {
    return `This action updates a #${id} mainProductCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} mainProductCategory`;
  }
}
