import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { actionsConnstants } from 'src/constants';
import { MainProductCategoriesService } from 'src/main-product-categories/main-product-categories.service';
import { Raw, Repository } from 'typeorm';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
  QueryProductCategoryDto,
} from './dto';
import { ProductCategory } from './entities/product-category.entity';

@Injectable()
export class ProductCategoriesService {
  private readonly logger = new Logger(ProductCategoriesService.name);

  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    private readonly commonService: CommonService,
    private readonly mainProductCategoriesService: MainProductCategoriesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    const mpc = await this.mainProductCategoriesService.findOne(
      createProductCategoryDto.mpcId,
    );

    try {
      const pcCreate = await this.productCategoryRepository.create({
        ...createProductCategoryDto,
        mainProductCategory: mpc,
      });
      const pc = await this.productCategoryRepository.save(pcCreate);
      await this.commonService.saveAudit(actionsConnstants.CREATE, {
        message: `Categoria del Producto => ID: ${pc.id}, nombre: ${pc.name}`,
      });
      return pc;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'create',
        error,
        logger: this.logger,
      });
    }
  }

  async findAll(query: QueryProductCategoryDto) {
    try {
      const users = await this.productCategoryRepository.find({
        where: {
          ...(query.id && { id: query.id }),
          ...(query.name && {
            name: Raw(
              (alias) => `LOWER(${alias}) Like '%${query.name.toLowerCase()}%'`,
            ),
          }),
          isActive: true,
          mainProductCategory: {
            isActive: true,
            ...(query.mpcId && { id: query.mpcId }),
          },
        },
        relations: ['mainProductCategory'],
        order: {
          id: 'DESC',
        },
      });
      return users;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'findAll',
        error,
        logger: this.logger,
      });
    }
  }

  async findOne(id: number) {
    try {
      const pc = await this.productCategoryRepository.findOne({
        where: {
          id,
          isActive: true,
        },
        relations: ['mainProductCategory'],
      });
      if (!pc) {
        throw new NotFoundException(
          `Product Category not found with ID: ${id}`,
        );
      }
      return pc;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'findOne',
        error,
        logger: this.logger,
      });
    }
  }

  async update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    await this.findOne(id);
    try {
      const { name, mpcId } = updateProductCategoryDto;
      const pcPreload = await this.productCategoryRepository.preload({
        id,
        ...(name && { name }),
        ...(mpcId && {
          mainProductCategory: await this.mainProductCategoriesService.findOne(
            mpcId,
          ),
        }),
      });
      const pc = await this.productCategoryRepository.save(pcPreload);
      await this.commonService.saveAudit(actionsConnstants.UPDATE, {
        message: `Categoria del Producto => ID: ${pc.id}, nombre: ${pc.name}`,
      });
      return pc;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'update',
        error,
        logger: this.logger,
      });
    }
  }

  async remove(id: number) {
    const pc = await this.findOne(id);
    try {
      await this.productCategoryRepository.delete(id);
      await this.commonService.saveAudit(actionsConnstants.DELETE, {
        message: `Usuario => ID: ${pc.id}, nombre: ${pc.name}`,
      });
      return pc;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'remove',
        error,
        logger: this.logger,
      });
    }
  }
}
