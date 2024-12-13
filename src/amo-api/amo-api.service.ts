import { Injectable } from '@nestjs/common';
import { TResponseWhenInstallWebHook } from 'src/shared/types/types';
import { envGrantType } from 'src/shared/env.enum';
import { AccountService } from 'src/account/account.service';
import { AmoApiQueryService } from './services/amo-api.query.service';
import { AmoApiMainService } from './services/amo-api.main.service';

@Injectable()
export class AmoApiService {
    constructor(
        private readonly accountService: AccountService,
        private readonly amoApiQueryService: AmoApiQueryService,
        private readonly amoApiMainService: AmoApiMainService
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async installIntegration({
        responseWhenInstallWebHook,
    }: {
        responseWhenInstallWebHook: TResponseWhenInstallWebHook;
    }): Promise<void> {
        try {
            const accessAndRefreshTokens =
                await this.amoApiQueryService.getAccessAndRefreshTokens({
                    dataForGetTokens: responseWhenInstallWebHook,
                    grandType: envGrantType.Authorization_Code,
                });

            const accountInfoFromCrm =
                await this.amoApiQueryService.getAccountInfo({
                    accessToken: accessAndRefreshTokens.access_token,
                    subdomain: responseWhenInstallWebHook.referer,
                });

            const existAccount =
                await this.accountService.findAccountByAccountId({
                    accountId: accountInfoFromCrm.id,
                });

            if (existAccount) {
                await this.accountService.updateAccount({
                    accountId: accountInfoFromCrm.id,
                    accessToken: accessAndRefreshTokens.access_token,
                    refreshToken: accessAndRefreshTokens.refresh_token,
                    isInstalled: true,
                });
            } else {
                await this.accountService.createAccount({
                    accountId: accountInfoFromCrm.id,
                    subdomain: responseWhenInstallWebHook.referer,
                    accessToken: accessAndRefreshTokens.access_token,
                    refreshToken: accessAndRefreshTokens.refresh_token,
                    isInstalled: true,
                    integration_id: responseWhenInstallWebHook.client_id,
                });
            }

            /* Часть 2. Кастомные поля */

            await this.amoApiMainService.addCustomFieldsInAmoCrmAndDBInstallIntegration(
                {
                    subdomain: responseWhenInstallWebHook.referer,
                    accessToken: accessAndRefreshTokens.access_token,
                }
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async unInstallIntegration({
        accountId,
    }: {
        accountId: number;
    }): Promise<void> {
        try {
            /* Часть 1 */
            await this.accountService.updateAccount({
                accountId,
                accessToken: null,
                refreshToken: null,
                isInstalled: false,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
