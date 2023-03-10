import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { UserTypesService } from 'src/user-types/user-types.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { actionsConnstants } from 'src/constants';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commonService: CommonService,
    private readonly userTypeService: UserTypesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  getMeesageAudit(user) {
    return {
      message: `Usuario => ID: ${user.id}, nombre: ${user.name}, tipo: ${user.userType.name}`,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const userType = await this.userTypeService.findOne(createUserDto.typeId);

    try {
      const userCreate = await this.userRepository.create({
        name: createUserDto.name,
        password: createUserDto.password,
        userType,
      });
      const user = await this.userRepository.save(userCreate);
      await this.commonService.saveAudit(
        actionsConnstants.CREATE,
        this.getMeesageAudit(user),
      );
      return user;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'create',
        error,
        logger: this.logger,
      });
    }
  }

  async findAll(query: QueryUserDto) {
    try {
      const users = await this.userRepository.find({
        where: {
          ...(query.id && { id: query.id }),
          isActive: true,
          userType: {
            isActive: true,
            ...(query.typeId && { id: query.typeId }),
          },
        },
        relations: ['userType'],
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

  async usersLogin() {
    try {
      const users = await this.userRepository.find({
        where: {
          isActive: true,
          userType: {
            isActive: true,
          },
        },
        relations: ['userType'],
      });

      const usersLogin = [];

      users.forEach(({ id, name, userType: { name: nameUserType } }) => {
        usersLogin.push({ id, name, nameUserType });
      });

      return usersLogin;
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
      const user = await this.userRepository.findOne({
        where: {
          id,
          isActive: true,
        },
        relations: ['userType'],
      });
      if (!user) {
        throw new NotFoundException(`User not found with ID: ${id}`);
      }
      return user;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'findOne',
        error,
        logger: this.logger,
      });
    }
  }

  async findOneBy(where: FindOptionsWhere<User>) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          ...where,
          isActive: true,
        },
        relations: ['userType'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'findOneBy',
        error,
        logger: this.logger,
      });
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    try {
      const { name, password, typeId } = updateUserDto;
      const userPreload = await this.userRepository.preload({
        id,
        ...(name && { name }),
        ...(password && { password }),
        ...(typeId && {
          userType: await this.userTypeService.findOne(typeId),
        }),
      });
      const user = await this.userRepository.save(userPreload);
      await this.commonService.saveAudit(
        actionsConnstants.UPDATE,
        this.getMeesageAudit(user),
      );
      return user;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'update',
        error,
        logger: this.logger,
      });
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    try {
      await this.userRepository.delete(id);
      await this.commonService.saveAudit(
        actionsConnstants.DELETE,
        this.getMeesageAudit(user),
      );
      return user;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'remove',
        error,
        logger: this.logger,
      });
    }
  }
}
