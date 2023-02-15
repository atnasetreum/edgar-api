import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainProductCategory } from 'src/main-product-categories/entities/main-product-category.entity';
import { ProductCategory } from 'src/product-categories/entities/product-category.entity';
import { Product } from './entities/product.entity';
import { ProductPrice } from './entities/product-prices.entity';
import { MainProductCategoriesModule } from 'src/main-product-categories/main-product-categories.module';
import { ProductCategoriesModule } from '../product-categories/product-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MainProductCategory,
      ProductCategory,
      Product,
      ProductPrice,
    ]),
    MainProductCategoriesModule,
    ProductCategoriesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [TypeOrmModule, ProductsService],
})
export class ProductsModule {}
