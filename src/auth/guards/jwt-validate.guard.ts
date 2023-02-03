import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class JwtValidateGuard implements CanActivate {
  constructor(private readonly commonService: CommonService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = (req.headers['authorization'] || '').replace('Bearer ', '');

    if (!token) {
      throw new BadRequestException('Token no encontrado.');
    }

    const { id } = this.commonService.decodedJwt(token) as { id: number };

    req.userId = id;

    return true;
  }
}
