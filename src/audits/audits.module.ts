import { Module } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { AuditsController } from './audits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Audit]), CommonModule],
  controllers: [AuditsController],
  providers: [AuditsService],
  exports: [TypeOrmModule, AuditsService],
})
export class AuditsModule {}
