import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly appKey: string) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const xAppKey = req.headers['x-app-key'];

    if (!xAppKey) {
      throw new BadRequestException('Clave de aplicacion no encontrada.');
    }

    if (this.appKey !== xAppKey) {
      throw new ForbiddenException(`Clave de aplicacion no valida`);
    }

    return true;
  }
}
