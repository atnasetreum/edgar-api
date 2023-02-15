import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { actionsConnstants } from 'src/constants';
import { Repository } from 'typeorm';
import { CreateUserTypeDto, QueryUserTypeDto, UpdateUserTypeDto } from './dto';
import { UserType } from './entities/user-type.entity';

@Injectable()
export class UserTypesService {
  private readonly logger = new Logger(UserTypesService.name);

  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
    private readonly commonService: CommonService,
  ) {}

  getMeesageAudit(userType) {
    return {
      message: `Tipo de usuario => ID: ${userType.id}, nombre: ${userType.name}`,
    };
  }

  async create(createUserTypeDto: CreateUserTypeDto) {
    try {
      const userTypeCreate = await this.userTypeRepository.create(
        createUserTypeDto,
      );
      const userType = await this.userTypeRepository.save(userTypeCreate);
      await this.commonService.saveAudit(
        actionsConnstants.CREATE,
        this.getMeesageAudit(userType),
      );
      return userType;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'create',
        error,
        logger: this.logger,
      });
    }
  }

  async findAll(query: QueryUserTypeDto) {
    try {
      const userTypes = await this.userTypeRepository.find({
        where: {
          isActive: true,
          ...(query.id && { id: query.id }),
          // ...(query?.name && {
          //   name: Raw(
          //     (alias) => `LOWER(${alias}) Like '%${query.name.toLowerCase()}%'`,
          //   ),
          // }),
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

  async update(id: number, updateUserTypeDto: UpdateUserTypeDto) {
    await this.findOne(id);
    try {
      const { name } = updateUserTypeDto;
      const userTypePreload = await this.userTypeRepository.preload({
        id,
        ...(name && { name }),
      });
      const userType = await this.userTypeRepository.save(userTypePreload);
      await this.commonService.saveAudit(
        actionsConnstants.UPDATE,
        this.getMeesageAudit(userType),
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
    const userType = await this.findOne(id);
    try {
      await this.userTypeRepository.delete(id);
      await this.commonService.saveAudit(
        actionsConnstants.DELETE,
        this.getMeesageAudit(userType),
      );
      return userType;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'remove',
        error,
        logger: this.logger,
      });
    }
  }
}
