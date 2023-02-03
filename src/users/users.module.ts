import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CommonModule } from 'src/common/common.module';
import { UserTypesModule } from 'src/user-types/user-types.module';
import { AuditsModule } from 'src/audits/audits.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CommonModule,
    UserTypesModule,
    AuditsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
