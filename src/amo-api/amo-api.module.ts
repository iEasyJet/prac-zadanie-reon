import { Module } from '@nestjs/common';
import { AmoApiService } from './amo-api.service';
import { HttpModule } from '@nestjs/axios';
import { AmoApiController } from './amo-api.controller';
import { AccountModule } from 'src/account/account.module';
import { CustomFieldModule } from 'src/custom-field/custom-field.module';

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        AccountModule,
        CustomFieldModule,
    ],
    providers: [AmoApiService],
    controllers: [AmoApiController],
    exports: [AmoApiService],
})
export class AmoApiModule {}
