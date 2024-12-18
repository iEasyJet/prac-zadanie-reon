/* eslint-disable indent */
import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { AmoApiService } from './amo-api.service';
import { TQueryWhenInstallWebHook } from './types/types';
import { Endpoints } from 'src/shared/constants/endpoints';

@Controller(Endpoints.AmoApi.Endpoint.AmoIntegration.AmoIntegration)
export class AmoApiController {
    constructor(private readonly amoApiService: AmoApiService) {}

    @Get(Endpoints.AmoApi.Endpoint.AmoIntegration.Next.Add)
    public async installIntegration(
        @Query() queryWhenInstallWebHook: TQueryWhenInstallWebHook
    ): Promise<void> {
        await this.amoApiService.installIntegration({
            queryWhenInstallWebHook,
        });
    }

    @Get(Endpoints.AmoApi.Endpoint.AmoIntegration.Next.Delete)
    public async unInstallIntegration(
        @Query('account_id', ParseIntPipe)
        account_id: number
    ): Promise<void> {
        await this.amoApiService.unInstallIntegration({
            accountId: account_id,
        });
    }
}
