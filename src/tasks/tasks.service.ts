import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AccountService } from 'src/account/account.service';
import { AmoApiService } from 'src/amo-api/amo-api.service';
import { envGrantType } from 'src/shared/env.enum';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        private readonly accountService: AccountService,
        private readonly amoApiService: AmoApiService
    ) {}
    /* '45 * * * * *' */

    @Cron(CronExpression.EVERY_12_HOURS)
    public async handleCron(): Promise<void> {
        this.logger.debug('Updated accounts tokens!');
        const accounts =
            await this.accountService.findAllAccountWhereIntegrationInstall();

        if (!accounts) {
            return;
        }
        accounts.forEach(async (account) => {
            const updatedTokens =
                await this.amoApiService.getAccessAndRefreshTokens({
                    dataForGetTokens: {
                        referer: account.subdomain,
                        client_id: account.integration_id,
                        refresh_token: account.refreshToken,
                    },
                    grandType: envGrantType.Refresh_Token,
                });

            await this.accountService.updateAccount({
                accountId: account.accountId,
                accessToken: updatedTokens.access_token,
                refreshToken: updatedTokens.refresh_token,
            });
        });
    }
}
