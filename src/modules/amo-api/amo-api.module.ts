import { forwardRef, Module } from '@nestjs/common';
import { AmoApiService } from './amo-api.service';
import { HttpModule } from '@nestjs/axios';
import { AmoApiController } from './amo-api.controller';
import { AmoApiRepository } from './services/amo-api.repository';
import { AccountModule } from '../account/account.module';
import { CustomFieldModule } from '../custom-field/custom-field.module';
import { AmoApiWebHook } from './services/amo-api.webhook';
import { AmoApiHelper } from './services/amo-api.helper';

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        forwardRef(() => AccountModule),
        forwardRef(() => CustomFieldModule),
    ],
    providers: [AmoApiService, AmoApiRepository, AmoApiWebHook, AmoApiHelper],
    controllers: [AmoApiController],
    exports: [AmoApiService, AmoApiRepository, AmoApiWebHook],
})
export class AmoApiModule {}
