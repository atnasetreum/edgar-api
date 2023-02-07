import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from './common.service';
import { Audit } from './entities/audit.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Audit]), ConfigModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
