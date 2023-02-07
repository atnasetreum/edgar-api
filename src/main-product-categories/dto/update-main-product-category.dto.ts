import { PartialType } from '@nestjs/mapped-types';
import { CreateMainProductCategoryDto } from './create-main-product-category.dto';

export class UpdateMainProductCategoryDto extends PartialType(CreateMainProductCategoryDto) {}
