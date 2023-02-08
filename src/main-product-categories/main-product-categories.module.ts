import { Module } from '@nestjs/common';
import { MainProductCategoriesService } from './main-product-categories.service';
import { MainProductCategoriesController } from './main-product-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainProductCategory } from './entities/main-product-category.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([MainProductCategory]), UsersModule],
  controllers: [MainProductCategoriesController],
  providers: [MainProductCategoriesService],
})
export class MainProductCategoriesModule {}
