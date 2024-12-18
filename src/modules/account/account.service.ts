import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { env } from 'src/shared/env.enum';
import { AccountRepository } from './account.repository';
import { AmoApiQueryService } from '../amo-api/services/amo-api.query.service';
import { envLimit } from './enums/limit.enum';
import { Endpoints } from 'src/shared/constants/endpoints';

@Injectable()
export class AccountService {
    private readonly logger = new Logger(AccountService.name);

    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly configService: ConfigService,
        private readonly amoApiQueryService: AmoApiQueryService
    ) {}

    /* '45 * * * * *' */

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
                        limit: envLimit.Limit_Account,
                    }
                );

            if (!accounts.length) {
                hasMoreAccounts = false;
                break;
            }

            await Promise.allSettled(
                accounts.map(async (account) => {
                    const updatedTokens =
                        await this.amoApiQueryService.getAccessAndRefreshTokens(
                            {
                                dataForGetTokens: {
                                    referer: account.subdomain,
                                    client_id: this.configService.get<string>(
                                        env.Client_ID
                                    ) as string,
                                    refresh_token: account.refreshToken,
                                },
                                grandType:
                                    Endpoints.AmoApi.GrantType.Refresh_Token,
                            }
                        );

                    await this.accountRepository.updateAccount({
                        accountId: account.accountId,
                        accessToken: updatedTokens.access_token,
                        refreshToken: updatedTokens.refresh_token,
                    });
                })
            );

            offset += envLimit.Limit_Account;
        }
    }
}
