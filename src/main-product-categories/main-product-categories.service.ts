import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { actionsConnstants } from 'src/constants';
import { Raw, Repository } from 'typeorm';
import {
  CreateMainProductCategoryDto,
  UpdateMainProductCategoryDto,
  QueryMainProductCategoryDto,
} from './dto';
import { MainProductCategory } from './entities/main-product-category.entity';

@Injectable()
export class MainProductCategoriesService {
  private readonly logger = new Logger(MainProductCategoriesService.name);

  constructor(
    @InjectRepository(MainProductCategory)
    private readonly mpcRepository: Repository<MainProductCategory>,
    private readonly commonService: CommonService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(createMainProductCategoryDto: CreateMainProductCategoryDto) {
    try {
      const mpcCreate = await this.mpcRepository.create(
        createMainProductCategoryDto,
      );
      const mpc = await this.mpcRepository.save(mpcCreate);
      await this.commonService.saveAudit(actionsConnstants.CREATE, {
        message: `Categoria principal => ID: ${mpc.id}, nombre: ${mpc.name}`,
      });
      return mpc;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'create',
        error,
        logger: this.logger,
      });
    }
  }

  async findAll(query: QueryMainProductCategoryDto) {
    try {
      const mpcs = await this.mpcRepository.find({
        where: {
          ...(query.id && { id: query.id }),
          ...(query?.name && {
            name: Raw(
              (alias) => `LOWER(${alias}) Like '%${query.name.toLowerCase()}%'`,
            ),
          }),
          isActive: true,
        },
        order: {
          id: 'DESC',
        },
      });
      return mpcs;
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
      const mpc = await this.mpcRepository.findOne({
        where: {
          id,
          isActive: true,
        },
      });
      if (!mpc) {
        throw new NotFoundException(`Mpc not found with ID: ${id}`);
      }
      return mpc;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'findOne',
        error,
        logger: this.logger,
      });
    }
  }

  async update(
    id: number,
    updateMainProductCategoryDto: UpdateMainProductCategoryDto,
  ) {
    await this.findOne(id);
    try {
      const mpcPreload = await this.mpcRepository.preload({
        id,
        ...updateMainProductCategoryDto,
      });
      const mpc = await this.mpcRepository.save(mpcPreload);
      await this.commonService.saveAudit(actionsConnstants.UPDATE, {
        message: `Categoria principal => ID: ${mpc.id}, nombre: ${mpc.name}`,
      });
      return mpc;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'update',
        error,
        logger: this.logger,
      });
    }
  }

  async remove(id: number) {
    const mpc = await this.findOne(id);
    try {
      await this.mpcRepository.delete(id);
      await this.commonService.saveAudit(actionsConnstants.DELETE, {
        message: `Categoria principal => ID: ${mpc.id}, nombre: ${mpc.name}`,
      });
      return mpc;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'remove',
        error,
        logger: this.logger,
      });
    }
  }
}
