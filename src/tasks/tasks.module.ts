import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AccountModule } from 'src/account/account.module';
import { AmoApiModule } from 'src/amo-api/amo-api.module';

@Module({
    imports: [AccountModule, AmoApiModule],
    providers: [TasksService],
})
export class TasksModule {}
