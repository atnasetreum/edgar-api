import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtValidateGuard } from 'src/auth/guards';
import { QueryHistoryDto } from './dto/query-history.dto';
import { HistoriesService } from './histories.service';

@Controller('histories')
@UseGuards(JwtValidateGuard)
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @Get()
  findAll(@Query() query: QueryHistoryDto) {
    return this.historiesService.findAll(query);
  }
}
