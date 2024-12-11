import { Controller, Get, Query } from '@nestjs/common';
import { AmoApiService } from './amo-api.service';
import {
    TResponseWhenInstallWebHook,
    TResponseWhenUnInstallWebHook,
} from 'src/shared/types/types';

@Controller('amo-integration')
export class AmoApiController {
    constructor(private readonly amoApiService: AmoApiService) {}

    @Get('add')
    async installIntegration(
        @Query() responseWhenInstallWebHook: TResponseWhenInstallWebHook
    ) {
        this.amoApiService.installIntegration({ responseWhenInstallWebHook });
    }

    @Get('delete')
    async unInstallIntegration(
        @Query() responseWhenUnInstallWebHook: TResponseWhenUnInstallWebHook
    ) {
        const accountId = Number(responseWhenUnInstallWebHook.account_id);
        this.amoApiService.unInstallIntegration({
            accountId,
        });
    }
}
