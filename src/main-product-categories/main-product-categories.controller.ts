import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MainProductCategoriesService } from './main-product-categories.service';
import {
  CreateMainProductCategoryDto,
  UpdateMainProductCategoryDto,
  QueryMainProductCategoryDto,
} from './dto';
import { JwtValidateGuard } from 'src/auth/guards';

@Controller('main-product-categories')
@UseGuards(JwtValidateGuard)
export class MainProductCategoriesController {
  constructor(
    private readonly mainProductCategoriesService: MainProductCategoriesService,
  ) {}

  @Post()
  create(@Body() createMainProductCategoryDto: CreateMainProductCategoryDto) {
    return this.mainProductCategoriesService.create(
      createMainProductCategoryDto,
    );
  }

  @Get()
  findAll(@Query() query: QueryMainProductCategoryDto) {
    return this.mainProductCategoriesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mainProductCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMainProductCategoryDto: UpdateMainProductCategoryDto,
  ) {
    return this.mainProductCategoriesService.update(
      +id,
      updateMainProductCategoryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mainProductCategoriesService.remove(+id);
  }
}
