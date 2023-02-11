import { Module } from '@nestjs/common';
import { MainProductCategoriesService } from './main-product-categories.service';
import { MainProductCategoriesController } from './main-product-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainProductCategory } from './entities/main-product-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MainProductCategory])],
  controllers: [MainProductCategoriesController],
  providers: [MainProductCategoriesService],
  exports: [TypeOrmModule, MainProductCategoriesService],
})
export class MainProductCategoriesModule {}
