import { Module } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { HistoriesController } from './histories.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [HistoriesController],
  providers: [HistoriesService],
  exports: [HistoriesService],
})
export class HistoriesModule {}
