import { Module } from '@nestjs/common';
import { UserTypesService } from './user-types.service';
import { UserTypesController } from './user-types.controller';
import { UserType } from './entities/user-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserType]), CommonModule],
  controllers: [UserTypesController],
  providers: [UserTypesService],
  exports: [TypeOrmModule, UserTypesService],
})
export class UserTypesModule {}
