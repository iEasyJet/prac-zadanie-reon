import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/shared/env.enum';
import { AccountRepository } from './account.repository';
import { AmoApiQueryService } from '../amo-api/services/amo-api.query.service';
import { Endpoints } from 'src/shared/constants/endpoints';
import { AccountDocument } from './models/account.model';

@Injectable()
export class AccountService {
    private readonly logger = new Logger(AccountService.name);

    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly configService: ConfigService,
        private readonly amoApiQueryService: AmoApiQueryService
    ) {}

    /* '45 * * * * *' */
    /* CronExpression.EVERY_12_HOURS */

    @Cron(CronExpression.EVERY_12_HOURS)
    public async handleCron(): Promise<void> {
        this.logger.debug('Updated accounts tokens!');

        let offset = 0;
        let hasMoreAccounts = true;

        while (hasMoreAccounts) {
            const accounts =
                await this.accountRepository.findAllAccountWhereIntegrationInstall(
                    {
                        offset,
                    }
                );

            if (!accounts.length) {
                hasMoreAccounts = false;
                break;
            }

            await Promise.allSettled(
                accounts.map(
                    async (account) => await this.preparingAccountData(account)
                )
            );

            offset += this.accountRepository.findAccountsLimit;
        }
    }

    private async preparingAccountData(
        account: AccountDocument
    ): Promise<AccountDocument> {
        const updatedTokens =
            await this.amoApiQueryService.getAccessAndRefreshTokens({
                dataForGetTokens: {
                    referer: account.subdomain,
                    client_id: this.configService.get<string>(
                        Env.ClientID
                    ) as string,
                    refresh_token: account.refreshToken,
                },
                grandType: Endpoints.AmoApi.GrantType.Refresh_Token,
            });

        return this.accountRepository.updateAccount(account.id, {
            accessToken: updatedTokens.access_token,
            refreshToken: updatedTokens.refresh_token,
        });
    }
}
