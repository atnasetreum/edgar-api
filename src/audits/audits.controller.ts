import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtValidateGuard } from 'src/auth/guards';
import { AuditsService } from './audits.service';
import { QueryAuditDto } from './dto';

@Controller('audits')
@UseGuards(JwtValidateGuard)
export class AuditsController {
  constructor(private readonly auditsService: AuditsService) {}

  @Get()
  findAll(@Query() query: QueryAuditDto) {
    return this.auditsService.findAll(query);
  }
}
