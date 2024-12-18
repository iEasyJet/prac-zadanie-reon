import { Injectable } from '@nestjs/common';
import { TAccount_ID, TQueryWhenInstallWebHook } from './types/types';
import { AmoApiQueryService } from './services/amo-api.query.service';
import { AmoApiMainService } from './services/amo-api.main.service';
import { AccountRepository } from '../account/account.repository';
import { Endpoints } from 'src/shared/constants/endpoints';
import { CustomFieldRepository } from '../custom-field/custom-field.repository';

@Injectable()
export class AmoApiService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly amoApiQueryService: AmoApiQueryService,
        private readonly amoApiMainService: AmoApiMainService,
        private readonly customFieldRepository: CustomFieldRepository
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async installIntegration({
        queryWhenInstallWebHook,
    }: {
        queryWhenInstallWebHook: TQueryWhenInstallWebHook;
    }): Promise<void> {
        const accessAndRefreshTokens =
            await this.amoApiQueryService.getAccessAndRefreshTokens({
                dataForGetTokens: queryWhenInstallWebHook,
                grandType: Endpoints.AmoApi.GrantType.Authorization_Code,
            });

        const accountInfoFromCrm = await this.amoApiQueryService.getAccountInfo(
            {
                accessToken: accessAndRefreshTokens.access_token,
                subdomain: queryWhenInstallWebHook.referer,
            }
        );

        const existAccount =
            await this.accountRepository.checkAccountByAccountId({
                accountId: accountInfoFromCrm.id,
            });

        if (existAccount) {
            await this.accountRepository.updateAccount({
                accountId: accountInfoFromCrm.id,
                accessToken: accessAndRefreshTokens.access_token,
                refreshToken: accessAndRefreshTokens.refresh_token,
                isInstalled: Endpoints.Account.Install,
            });
        } else {
            await this.accountRepository.createAccount({
                accountId: accountInfoFromCrm.id,
                subdomain: queryWhenInstallWebHook.referer,
                accessToken: accessAndRefreshTokens.access_token,
                refreshToken: accessAndRefreshTokens.refresh_token,
                isInstalled: Endpoints.Account.Install,
            });
        }

        /* Часть 2. Кастомные поля */

        await this.amoApiMainService.addCustomFieldsInAmoCrmAndDBInstallIntegration(
            {
                subdomain: queryWhenInstallWebHook.referer,
                accessToken: accessAndRefreshTokens.access_token,
            }
        );
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async unInstallIntegration({
        accountId,
    }: TAccount_ID): Promise<void> {
        /* Часть 1 */

        await this.accountRepository.clearAccount({
            accountId,
        });

        /* Часть 2 */

        await this.customFieldRepository.deleteCustomFieldByAccountId({
            accountId,
        });
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
