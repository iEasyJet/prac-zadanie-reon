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
    public async installIntegration(
        @Query() responseWhenInstallWebHook: TResponseWhenInstallWebHook
    ): Promise<void> {
        await this.amoApiService.installIntegration({
            responseWhenInstallWebHook,
        });
    }

    @Get('delete')
    public async unInstallIntegration(
        @Query() responseWhenUnInstallWebHook: TResponseWhenUnInstallWebHook
    ): Promise<void> {
        const accountId = Number(responseWhenUnInstallWebHook.account_id);
        await this.amoApiService.unInstallIntegration({
            accountId,
        });
    }
}
