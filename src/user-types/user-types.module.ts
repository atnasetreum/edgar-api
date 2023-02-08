import { Module } from '@nestjs/common';
import { UserTypesService } from './user-types.service';
import { UserTypesController } from './user-types.controller';
import { UserType } from './entities/user-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserType])],
  controllers: [UserTypesController],
  providers: [UserTypesService],
  exports: [TypeOrmModule, UserTypesService],
})
export class UserTypesModule {}
