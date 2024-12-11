import { Module } from '@nestjs/common';
import { databaseService } from './database.service';

@Module({
  providers: [...databaseService],
  exports: [...databaseService],
})
export class DatabaseModule {}
