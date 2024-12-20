import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AmoApiRepository } from './services/amo-api.repository';
import { AmoApiWebHook } from './services/amo-api.webhook';
import { AccountSettings } from 'src/shared/constants/account-settings.const';
import { Path } from 'src/shared/constants/path.const';
import { CustomFieldService } from '../custom-field/custom-field.service';
import { AccountService } from '../account/account.service';
import { TQueryWhenInstallWebHook } from './types/query-when-install-webhook.type';
import { TAccountId } from './types/account-id.type';
import { TResponseWithTokens } from './types/response-with-tokens.type';
import { TGetCustomFields } from './types/get-custom-fields.type';
import { TPatchContactCustomFields } from './types/patch-contact-custom-fields.type';
import { TFieldObject } from '../../shared/types/field-object.type';
import { TCreateCustomFields } from './types/create-custom-fields.type';
import { TGetTokens } from './types/get-tokens.type';
import { TLead } from 'src/shared/types/lead/lead.type';
import { TGetLeadInfo } from './types/get-lead-info.type';

@Injectable()
export class AmoApiService {
    constructor(
        //@Inject(forwardRef(() => AmoApiRepository))
        private readonly amoApiRepository: AmoApiRepository,
        //@Inject(forwardRef(() => AmoApiWebHook))
        private readonly amoApiWebHook: AmoApiWebHook,
        @Inject(forwardRef(() => AccountService))
        private readonly accountService: AccountService,
        //@Inject(forwardRef(() => CustomFieldService))
        private readonly customFieldService: CustomFieldService
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async installIntegration({
        queryWhenInstallWebHook,
    }: {
        queryWhenInstallWebHook: TQueryWhenInstallWebHook;
    }): Promise<void> {
        const accessAndRefreshTokens = await this.getTokens({
            code: queryWhenInstallWebHook.code,
            referer: queryWhenInstallWebHook.referer,
        });

        const accountInfoFromCrm = await this.amoApiRepository.getAccountInfo({
            accessToken: accessAndRefreshTokens.access_token,
            subdomain: queryWhenInstallWebHook.referer,
        });

        const account = await this.accountService.getAccountByAccountId({
            accountId: accountInfoFromCrm.id,
        });

        if (account) {
            await this.accountService.updateAccount(account.id, {
                accessToken: accessAndRefreshTokens.access_token,
                refreshToken: accessAndRefreshTokens.refresh_token,
                isInstalled: AccountSettings.Install,
            });
        } else {
            await this.accountService.createAccount({
                accountId: accountInfoFromCrm.id,
                subdomain: queryWhenInstallWebHook.referer,
                accessToken: accessAndRefreshTokens.access_token,
                refreshToken: accessAndRefreshTokens.refresh_token,
                isInstalled: AccountSettings.Install,
            });
        }

        /* Часть 2. Кастомные поля */

        await this.customFieldService.addCustomFieldsInAmoCrmAndDBInstallIntegration(
            {
                subdomain: queryWhenInstallWebHook.referer,
                accessToken: accessAndRefreshTokens.access_token,
                whichField: 'Contact',
            }
        );

        await this.customFieldService.addCustomFieldsInAmoCrmAndDBInstallIntegration(
            {
                subdomain: queryWhenInstallWebHook.referer,
                accessToken: accessAndRefreshTokens.access_token,
                whichField: 'Lead',
            }
        );

        /* Часть 3. Установка хуков */

        const webHooksFromAmo = await this.amoApiWebHook.getWebHooks({
            subdomain: queryWhenInstallWebHook.referer,
            pathQ: Path.WebHooks,
            accessToken: accessAndRefreshTokens.access_token,
        });

        const webHooksForInstall =
            await this.amoApiWebHook.checkWebHooksNotInstall({
                webhooks: webHooksFromAmo,
            });

        if (webHooksForInstall.length) {
            Promise.allSettled(
                webHooksForInstall.map((hook) => {
                    const payload = {
                        destination: hook.path,
                        settings: [hook.name],
                    };

                    this.amoApiWebHook.addWebHook({
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
    }: TAccountId): Promise<void> {
        /* Часть 1 */

        const account = await this.accountService.getAccountByAccountId({
            accountId,
        });

        await this.accountService.clearAccount({
            id: account.id,
        });

        /* Часть 2 */

        await this.customFieldService.deleteCustomFieldsByAccountId({
            accountId,
        });
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getTokens({
        code,
        referer,
    }: TGetTokens): Promise<TResponseWithTokens> {
        const tokens = await this.amoApiRepository.getTokens({
            code,
            referer,
        });

        return tokens;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async updateToken({
        referer,
        refresh_token,
    }: TGetTokens): Promise<TResponseWithTokens> {
        const tokens = await this.amoApiRepository.updateToken({
            referer,
            refresh_token,
        });

        return tokens;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getCustomFields({
        subdomain,
        pathQ,
        accessToken,
    }: TGetCustomFields): Promise<TFieldObject[]> {
        const customFields = await this.amoApiRepository.getCustomFields({
            subdomain,
            pathQ,
            accessToken,
        });

        return customFields;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async patchContactCustomFields({
        subdomain,
        accessToken,
        payload,
        pathQ,
    }: TPatchContactCustomFields): Promise<void> {
        await this.amoApiRepository.patchContactCustomFields({
            subdomain,
            accessToken,
            payload,
            pathQ,
        });
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async createCustomFields({
        subdomain,
        accessToken,
        payload,
        pathQ,
    }: TCreateCustomFields): Promise<TFieldObject[]> {
        const customFields = await this.amoApiRepository.createCustomFields({
            subdomain,
            accessToken,
            payload,
            pathQ,
        });

        return customFields;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getLeadInfo({
        subdomain,
        accessToken,
        pathQ,
    }: TGetLeadInfo): Promise<TLead> {
        const lead = await this.amoApiRepository.getLeadInfo({
            subdomain,
            accessToken,
            pathQ,
        });

        return lead;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
