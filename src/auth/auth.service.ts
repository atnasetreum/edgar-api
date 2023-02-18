import { Request } from 'express';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { LoginAuthDto } from './dto';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly commonService: CommonService,
  ) {}

  responseUserSession(user: User) {
    return {
      id: user.id,
      name: user.name,
      userType: user.userType.name,
      token: this.commonService.createJwt({ id: user.id }),
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findOne(loginAuthDto.id);
    if (await argon2.verify(user.password, loginAuthDto.password)) {
      return this.responseUserSession(user);
    }
    throw new UnauthorizedException('Credenciales no validas');
  }

  async validateToken(request: Request) {
    const authorization = (request.headers?.authorization as string) || '';
    const token = authorization.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Credenciales no validas');
    }
    const { id } = this.commonService.decodedJwt(token);
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.responseUserSession(user);
  }
}
