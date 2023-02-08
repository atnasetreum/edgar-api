import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { QueryHistoryDto } from './dto/query-history.dto';

@Injectable()
export class HistoriesService {
  constructor(private readonly commonService: CommonService) {}
  findAll(query: QueryHistoryDto) {
    return this.commonService.getAllAudit(query);
  }
}
