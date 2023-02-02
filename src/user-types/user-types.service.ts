import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { CreateUserTypeDto, UpdateUserTypeDto } from './dto';
import { UserType } from './entities/user-type.entity';

@Injectable()
export class UserTypesService {
  private readonly logger = new Logger(UserTypesService.name);

  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
    private readonly commonService: CommonService,
  ) {}

  async create(createUserTypeDto: CreateUserTypeDto) {
    try {
      const userTypeCreate = await this.userTypeRepository.create(
        createUserTypeDto,
      );
      const userType = await this.userTypeRepository.save(userTypeCreate);
      return userType;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'create',
        error,
        logger: this.logger,
      });
    }
  }

  async findAll() {
    try {
      const userTypes = await this.userTypeRepository.find({
        where: {
          isActive: true,
        },
      });
      return userTypes;
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
      const userType = await this.userTypeRepository.findOneBy({
        id,
        isActive: true,
      });
      if (!userType) {
        throw new NotFoundException(`UserType not found with ID: ${id}`);
      }
      return userType;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'findOne',
        error,
        logger: this.logger,
      });
    }
  }

  // async findOneBy(where: FindOptionsWhere<UserType>) {
  //   try {
  //     const userTypes = await this.userTypeRepository.findOne({
  //       where: {
  //         ...where,
  //         isActive: true,
  //       },
  //     });

  //     if (!userTypes) {
  //       throw new NotFoundException('UserType not found');
  //     }

  //     return userTypes;
  //   } catch (error) {
  //     this.commonService.handleExceptions({
  //       ref: 'findOneBy',
  //       error,
  //       logger: this.logger,
  //     });
  //   }
  // }

  async update(id: number, updateUserTypeDto: UpdateUserTypeDto) {
    await this.findOne(id);
    try {
      const { name } = updateUserTypeDto;
      const userTypePreload = await this.userTypeRepository.preload({
        ...(name && { name }),
      });
      const userType = await this.userTypeRepository.update(
        id,
        userTypePreload,
      );
      return userType;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'update',
        error,
        logger: this.logger,
      });
    }
  }

  async remove(id: number) {
    try {
      await this.userTypeRepository.delete(id);
      return 'ok';
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'remove',
        error,
        logger: this.logger,
      });
    }
  }
}
