import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountModule } from 'src/modules/account/account.module';
import { AmoApiModule } from 'src/modules/amo-api/amo-api.module';
import { env } from 'src/shared/env.enum';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>(env.MongoDB_URL),
            }),
            inject: [ConfigService],
        }),
        AccountModule,
        ScheduleModule.forRoot(),
        AmoApiModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
