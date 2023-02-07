import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CommonService } from 'src/common/common.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtValidateGuard implements CanActivate {
  constructor(
    private readonly commonService: CommonService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = (req.headers['authorization'] || '').replace('Bearer ', '');

    if (!token) {
      throw new BadRequestException('Token no encontrado.');
    }

    const { id } = this.commonService.decodedJwt(token) as { id: number };

    const user = await this.usersService.findOne(id);

    req.user = user;

    return true;
  }
}
