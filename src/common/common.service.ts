import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { QueryHistoryDto } from 'src/histories/dto/query-history.dto';
import { User } from 'src/users/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Audit } from './entities/audit.entity';

@Injectable()
export class CommonService {
  private secretKey: string;
  private readonly logger = new Logger(CommonService.name);
  constructor(
    @Inject(REQUEST) private readonly request,
    private readonly configService: ConfigService,
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
  ) {
    this.secretKey = this.configService.get<string>('jwt.secretKey');
  }

  private errorsAxios(error) {
    if (error?.response) {
      if (error.response?.status === 400) {
        throw new BadRequestException(
          error.response?.data?.message || 'Bad Request',
        );
      }
      if (error.response?.status === 401) {
        throw new UnauthorizedException(
          'The provided credentials are not valid',
        );
      }
      if (error.response?.status === 404) {
        throw new NotFoundException(
          error.response?.data?.error?.title ||
            error.response?.data?.message ||
            'Not Found',
        );
      }
    }
  }

  private errorsNest(error) {
    if (error?.response) {
      if (error.response?.statusCode === 403) {
        throw new ForbiddenException(error.response?.message || 'Forbidden');
      }
      if (error.response?.statusCode === 404) {
        throw new NotFoundException(error.response?.message || 'Not Found');
      }
    }
  }

  private errorsDB(error) {
    switch (error?.code) {
      case '23505':
        throw new BadRequestException(error?.detail || error?.message);
      case '23502':
        throw new BadRequestException(error?.detail || error?.message);
      case '22P02':
        throw new BadRequestException(error?.detail || error?.message);
      case '23503':
        throw new BadRequestException(
          'Eliminar dependencias a otras tablas primero',
        );
      default:
        break;
    }
  }

  handleExceptions({
    ref,
    error,
    logger,
  }: {
    ref: string;
    error: any;
    logger: any;
  }): never {
    //console.log({ error });
    // const { email, serviceRequest }: User = this.request.user;
    logger.error(`[${ref}]`, error);

    // logger.error(
    //   `[Ref => ${ref}] - [User Request => ${email}] ${
    //     serviceRequest ? `Service Request: ${serviceRequest}` : ''
    //   }`,
    //   error,
    // );

    const {
      code: errorDB = false,
      response: { statusCode: errorNest, status: errorAxios } = {
        statusCode: false,
        status: false,
      },
    } = error;

    //console.log({ errorNest, errorAxios, errorDB });

    if (errorNest) {
      this.errorsNest(error);
    } else if (errorAxios) {
      this.errorsAxios(error);
    } else if (errorDB) {
      this.errorsDB(error);
    }

    throw new InternalServerErrorException(
      'Unexpected error, Please check server logs',
    );
  }

  createJwt(payload) {
    return jwt.sign(payload, this.secretKey, { expiresIn: '1d' });
  }

  decodedJwt(token: string) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new UnauthorizedException(
        `Credenciales no validas: ${error.message}`,
      );
    }
  }

  async saveAudit(methodName: string, data: object) {
    try {
      const user = this.request.user as User;
      const auditCreate = await this.auditRepository.create({
        methodName,
        user,
        data,
      });
      const audit = await this.auditRepository.save(auditCreate);
      return audit;
    } catch (error) {
      this.handleExceptions({
        ref: 'saveAudit',
        error,
        logger: this.logger,
      });
    }
  }

  async getAllAudit(query: QueryHistoryDto) {
    const user = this.request.user as User;

    const where: FindOptionsWhere<Audit> = { isActive: true };

    if (query.id) {
      where.id = query.id;
    }

    if (query.methodName) {
      where.methodName = query.methodName;
    }

    if (user.userType.name === 'ADMIN') {
      if (query.userId) {
        where.user = { id: query.userId };
      }
    } else {
      where.user = { id: user.id };
    }

    try {
      const users = await this.auditRepository.find({
        where,
        relations: {
          user: {
            userType: true,
          },
        },
        order: {
          id: 'DESC',
        },
      });
      return users;
    } catch (error) {
      this.handleExceptions({
        ref: 'getAllAudit',
        error,
        logger: this.logger,
      });
    }
  }
}
