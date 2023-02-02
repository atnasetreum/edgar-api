import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CommonService {
  private secretKey: string;
  constructor(
    @Inject(REQUEST) private readonly request,
    private readonly configService: ConfigService,
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
}
