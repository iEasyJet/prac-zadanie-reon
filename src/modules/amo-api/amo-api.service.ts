import { Injectable } from '@nestjs/common';
import { TAccount_ID, TQueryWhenInstallWebHook } from './types/types';
import { AmoApiQueryService } from './services/amo-api.query.service';
import { AmoApiMainService } from './services/amo-api.main.service';
import { AccountRepository } from '../account/account.repository';
import { CustomFieldRepository } from '../custom-field/custom-field.repository';
import { AmoApiWebHookService } from './services/amo-api.webhook.service';
import { GrantType } from 'src/shared/constants/grand-type';
import { AccountSettings } from 'src/shared/constants/account-settings';
import { Path } from 'src/shared/constants/path';

@Injectable()
export class AmoApiService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly amoApiQueryService: AmoApiQueryService,
        private readonly amoApiMainService: AmoApiMainService,
        private readonly customFieldRepository: CustomFieldRepository,
        private readonly amoApiWebHookService: AmoApiWebHookService
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
                grandType: GrantType.AuthorizationCode,
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

        const account = await this.accountRepository.getAccountByAccountId({
            accountId: accountInfoFromCrm.id,
        });

        if (existAccount) {
            await this.accountRepository.updateAccount(account.id, {
                accessToken: accessAndRefreshTokens.access_token,
                refreshToken: accessAndRefreshTokens.refresh_token,
                isInstalled: AccountSettings.Install,
            });
        } else {
            await this.accountRepository.createAccount({
                accountId: accountInfoFromCrm.id,
                subdomain: queryWhenInstallWebHook.referer,
                accessToken: accessAndRefreshTokens.access_token,
                refreshToken: accessAndRefreshTokens.refresh_token,
                isInstalled: AccountSettings.Install,
            });
        }

        /* Часть 2. Кастомные поля */

        await this.amoApiMainService.addCustomFieldsInAmoCrmAndDBInstallIntegration(
            {
                subdomain: queryWhenInstallWebHook.referer,
                accessToken: accessAndRefreshTokens.access_token,
            }
        );

        /* Часть 3. Установка хуков */

        const webHooksFromAmo = await this.amoApiWebHookService.getWebHooks({
            subdomain: queryWhenInstallWebHook.referer,
            pathQ: Path.WebHooks,
            accessToken: accessAndRefreshTokens.access_token,
        });

        const webHooksForInstall =
            await this.amoApiWebHookService.checkWebHooksNotInstall({
                webhooks: webHooksFromAmo,
            });

        if (webHooksForInstall.length) {
            Promise.allSettled(
                webHooksForInstall.map((hook) => {
                    const payload = {
                        destination: hook.path,
                        settings: [hook.name],
                    };

                    this.amoApiWebHookService.addWebHook({
                        subdomain: queryWhenInstallWebHook.referer,
                        pathQ: Path.WebHooks,
                        accessToken: accessAndRefreshTokens.access_token,
                        payload,
                    });
                })
            );
        }
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async unInstallIntegration({
        accountId,
    }: TAccount_ID): Promise<void> {
        /* Часть 1 */

        const account = await this.accountRepository.getAccountByAccountId({
            accountId,
        });

        await this.accountRepository.clearAccount({
            id: account.id,
        });

        /* Часть 2 */

        await this.customFieldRepository.deleteCustomFieldByAccountId({
            accountId,
        });
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
