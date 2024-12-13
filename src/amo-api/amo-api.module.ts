import { Module } from '@nestjs/common';
import { AmoApiService } from './amo-api.service';
import { HttpModule } from '@nestjs/axios';
import { AmoApiController } from './amo-api.controller';
import { AccountModule } from 'src/account/account.module';
import { CustomFieldModule } from 'src/custom-field/custom-field.module';
import { AmoApiHelperService } from './services/amo-api.helper.service';
import { AmoApiQueryService } from './services/amo-api.query.service';
import { AmoApiMainService } from './services/amo-api.main.service';

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        AccountModule,
        CustomFieldModule,
    ],
    providers: [
        AmoApiService,
        AmoApiHelperService,
        AmoApiQueryService,
        AmoApiMainService,
    ],
    controllers: [AmoApiController],
    exports: [AmoApiQueryService],
})
export class AmoApiModule {}
