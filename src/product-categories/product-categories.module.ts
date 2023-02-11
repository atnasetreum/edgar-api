import { Module } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoriesController } from './product-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainProductCategory } from 'src/main-product-categories/entities/main-product-category.entity';
import { ProductCategory } from './entities/product-category.entity';
import { MainProductCategoriesModule } from 'src/main-product-categories/main-product-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MainProductCategory, ProductCategory]),
    MainProductCategoriesModule,
  ],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService],
  exports: [TypeOrmModule, ProductCategoriesService],
})
export class ProductCategoriesModule {}
