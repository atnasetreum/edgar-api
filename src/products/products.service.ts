import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Raw, Repository } from 'typeorm';
import { CreateProductDto, QueryProductDto, UpdateProductDto } from './dto';
import { Product, ProductPrice } from './entities';
import { MainProductCategoriesService } from 'src/main-product-categories/main-product-categories.service';
import { ProductCategoriesService } from 'src/product-categories/product-categories.service';
import { actionsConnstants } from 'src/constants';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductPrice)
    private readonly productPriceRepository: Repository<ProductPrice>,
    private readonly mainProductCategoriesService: MainProductCategoriesService,
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly commonService: CommonService,
  ) {}

  getMeesageAudit(product) {
    return {
      message: `Producto => ID: ${product.id}, nombre: ${product.name}, [${product.mainCategory.name}], [${product.category.name}], [$ ${product.price}]`,
    };
  }

  async createPrice(product, price) {
    const productCreate = await this.productPriceRepository.create({
      price,
      product,
    });
    return this.productPriceRepository.save(productCreate);
  }

  async create(createProductDto: CreateProductDto) {
    const mainCategory = await this.mainProductCategoriesService.findOne(
      createProductDto.mainCategoryId,
    );
    const category = await this.productCategoriesService.findOne(
      createProductDto.categoryId,
    );
    try {
      const productCreate = await this.productRepository.create({
        name: createProductDto.name,
        price: createProductDto.price,
        mainCategory,
        category,
      });
      const product = await this.productRepository.save(productCreate);

      await this.createPrice(product, product.price);

      await this.commonService.saveAudit(
        actionsConnstants.CREATE,
        this.getMeesageAudit(product),
      );
      return product;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'create',
        error,
        logger: this.logger,
      });
    }
  }

  async findAll(query: QueryProductDto) {
    try {
      const products = await this.productRepository.find({
        where: {
          ...(query.id && { id: query.id }),
          ...(query.name && {
            name: Raw(
              (alias) => `LOWER(${alias}) Like '%${query.name.toLowerCase()}%'`,
            ),
          }),
          isActive: true,
          mainCategory: {
            isActive: true,
            ...(query.mainCategoryId && { id: query.mainCategoryId }),
          },
          category: {
            isActive: true,
            ...(query.categoryId && { id: query.categoryId }),
          },
        },
        relations: ['mainCategory', 'category'],
        order: {
          id: 'DESC',
        },
      });
      return products;
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
      const product = await this.productRepository.findOne({
        where: {
          id,
          isActive: true,
        },
        relations: ['mainCategory', 'category'],
      });
      if (!product) {
        throw new NotFoundException(`Product not found with ID: ${id}`);
      }
      return product;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'findOne',
        error,
        logger: this.logger,
      });
    }
  }

  getDifference(a, b) {
    return a > b ? a - b : b - a;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { price: pricePreview } = await this.findOne(id);
    const mainCategory = await this.mainProductCategoriesService.findOne(
      updateProductDto.mainCategoryId,
    );
    const category = await this.productCategoriesService.findOne(
      updateProductDto.categoryId,
    );
    try {
      const { name, price } = updateProductDto;
      const productPreload = await this.productRepository.preload({
        id,
        name,
        price,
        mainCategory,
        category,
      });
      const product = await this.productRepository.save(productPreload);

      const diffPrice = this.getDifference(pricePreview, price);

      if (diffPrice !== 0) {
        await this.createPrice(product, price);
      }

      await this.commonService.saveAudit(
        actionsConnstants.UPDATE,
        this.getMeesageAudit(product),
      );
      return product;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'update',
        error,
        logger: this.logger,
      });
    }
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    try {
      await this.productRepository.delete(id);
      await this.commonService.saveAudit(
        actionsConnstants.DELETE,
        this.getMeesageAudit(product),
      );
      return product;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'remove',
        error,
        logger: this.logger,
      });
    }
  }
}
