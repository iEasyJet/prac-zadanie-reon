import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from 'src/tasks/tasks.module';
import { AccountModule } from 'src/account/account.module';
import { AmoApiModule } from 'src/amo-api/amo-api.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URL'),
            }),
            inject: [ConfigService],
        }),
        AccountModule,
        ScheduleModule.forRoot(),
        TasksModule,
        AmoApiModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
