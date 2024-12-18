import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountModule } from 'src/modules/account/account.module';
import { AmoApiModule } from 'src/modules/amo-api/amo-api.module';
import { Env } from 'src/shared/env.enum';
import * as Joi from 'joi';
import { ContactModule } from 'src/modules/contact/contact.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                [Env.Port]: Joi.number().required().port(),
                [Env.ClientID]: Joi.string().required(),
                [Env.ClientSecret]: Joi.string().required(),
                [Env.MongoDBUrl]: Joi.string().required(),
                [Env.RedirectURIWhenInstallIntegration]:
                    Joi.string().required(),
            }),
        }),
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>(Env.MongoDBUrl),
            }),
            inject: [ConfigService],
        }),
        AccountModule,
        ScheduleModule.forRoot(),
        AmoApiModule,
        ContactModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
