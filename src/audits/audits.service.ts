import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { CreateAuditDto, QueryAuditDto } from './dto';
import { Audit } from './entities/audit.entity';

@Injectable()
export class AuditsService {
  private readonly logger = new Logger(AuditsService.name);

  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
    private readonly commonService: CommonService,
  ) {}

  async create(createAuditDto: CreateAuditDto) {
    //const userType = await this.userTypeService.findOne(createUserDto.typeId);

    try {
      const auditCreate = await this.auditRepository.create({
        ...createAuditDto,
        //user,
      });
      const audit = await this.auditRepository.save(auditCreate);
      return audit;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'create',
        error,
        logger: this.logger,
      });
    }
  }

  async findAll(query: QueryAuditDto) {
    try {
      const audits = await this.auditRepository.find({
        where: {
          isActive: true,
        },
        order: {
          id: 'DESC',
        },
      });
      return audits;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'findAll',
        error,
        logger: this.logger,
      });
    }
  }
}
