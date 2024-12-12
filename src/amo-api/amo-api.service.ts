import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import {
    TGetTokens,
    TResponseAccountData,
    TResponseWhenInstallWebHook,
    TResponseWithTokens,
} from 'src/shared/types/types';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
    envCustomFieldContact,
    envCustomFieldLead,
    envCustomFieldTypeContact,
    envError,
    envGrantType,
    envOther,
    envPath,
} from 'src/shared/env.enum';
import { AxiosError } from 'axios';
import { AccountService } from 'src/account/account.service';
import { CustomFieldService } from 'src/custom-field/custom-field.service';
import { TFieldObject, TResponseCustomFeild } from './types/types';

@Injectable()
export class AmoApiService {
    private readonly logger = new Logger(AmoApiService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly accountService: AccountService,
        private readonly customFieldService: CustomFieldService
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async installIntegration({
        responseWhenInstallWebHook,
    }: {
        responseWhenInstallWebHook: TResponseWhenInstallWebHook;
    }): Promise<void> {
        try {
            const accessAndRefreshTokens = await this.getAccessAndRefreshTokens(
                {
                    dataForGetTokens: responseWhenInstallWebHook,
                    grandType: envGrantType.Authorization_Code,
                }
            );

            const accountInfoFromCrm = await this.getAccountInfo({
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

            /* */
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

    private async getAccountInfo({
        accessToken,
        subdomain,
    }: {
        accessToken: string;
        subdomain: string;
    }): Promise<TResponseAccountData> {
        const path = this.createPath({
            subdomain,
            path: envPath.Path_For_Account_Data,
        });

        const header = {
            headers: {
                Authorization: this.createHeaderAuthorization({
                    token: accessToken,
                }),
            },
        };

        const { data: accountData } = await firstValueFrom(
            this.httpService.get<TResponseAccountData>(path, header).pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error.response?.data);
                    throw envError.Error_For_Get_Account_Data;
                })
            )
        );

        return accountData;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getAccessAndRefreshTokens({
        dataForGetTokens,
        grandType,
    }: {
        dataForGetTokens: TGetTokens;
        grandType: string;
    }): Promise<TResponseWithTokens> {
        try {
            const path = this.createPath({
                subdomain: dataForGetTokens.referer,
                path: envPath.Path_For_Access_Token,
            });

            const payload = {
                client_id: dataForGetTokens.client_id,
                client_secret: this.configService.get('CLIENT_SECRET'),
                grant_type: grandType,
                code: dataForGetTokens.code ?? undefined,
                refresh_token: dataForGetTokens.refresh_token ?? undefined,
                redirect_uri: this.configService.get(
                    'REDIRECT_URI_WHEN_INSTALL_INTEGRATION'
                ),
            };

            const {
                data: accessAndRefreshTokens,
            }: { data: TResponseWithTokens } = await firstValueFrom(
                this.httpService.post(path, payload).pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(error.response?.data);
                        throw envError.Error_For_Post_Access_Refresh_Tokens;
                    })
                )
            );
            return accessAndRefreshTokens;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    private createPath({
        subdomain,
        path,
    }: {
        subdomain: string;
        path: string;
    }): string {
        return `https://${subdomain}${path}`;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    private createHeaderAuthorization({ token }: { token: string }): string {
        return `${envOther.Bearer} ${token}`;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    private async getCustomFields({
        subdomain,
        pathQ,
        accessToken,
    }: {
        subdomain: string;
        pathQ: string;
        accessToken: string;
    }): Promise<TResponseCustomFeild> {
        try {
            const path = this.createPath({
                subdomain,
                path: pathQ,
            });

            const header = {
                headers: {
                    Authorization: this.createHeaderAuthorization({
                        token: accessToken,
                    }),
                },
            };

            const { data: customFields } = await firstValueFrom(
                this.httpService.get<TResponseCustomFeild>(path, header).pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(error.response?.data);
                        throw envError.Error_For_Get_Custom_Fields;
                    })
                )
            );
            return customFields;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    private async createCustomFields({
        subdomain,
        accessToken,
        payload,
        pathQ,
    }: {
        subdomain: string;
        accessToken: string;
        payload: {
            name: string;
            type: string;
            sort: number;
        }[];
        pathQ: string;
    }): Promise<TFieldObject[]> {
        try {
            const path = this.createPath({
                subdomain,
                path: pathQ,
            });

            const headers = {
                headers: {
                    Authorization: this.createHeaderAuthorization({
                        token: accessToken,
                    }),
                },
            };

            const {
                data: {
                    _embedded: { custom_fields },
                },
            } = await firstValueFrom(
                this.httpService
                    .post<TResponseCustomFeild>(path, payload, headers)
                    .pipe(
                        catchError((error: AxiosError) => {
                            this.logger.error(error.response?.data);
                            throw envError.Error_For_Post_Custom_Fields;
                        })
                    )
            );
            return custom_fields;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    private async checkCustomFieldsInAmoCrm({
        subdomain,
        accessToken,
    }: {
        subdomain: string;
        accessToken: string;
    }): Promise<{
        filtredCustomFieldsContactInAmoCrm: TFieldObject[];
        customFieldsContactNotInAmoCrm: string[];
        maxValueSortContact: number;
        filtredCustomFieldsLeadInAmoCrm: TFieldObject[];
        customFieldsLeadNotInAmoCrm: string[];
        maxValueSortLead: number;
    }> {
        const {
            _embedded: { custom_fields: customFieldsContact },
        } = await this.getCustomFields({
            subdomain,
            pathQ: envPath.Path_For_Access_Token,
            accessToken,
        });

        const {
            _embedded: { custom_fields: customFieldsLead },
        } = await this.getCustomFields({
            subdomain,
            pathQ: envPath.Path_For_Leads_Custom_Fields,
            accessToken,
        });

        /* Contact */
        const valuesArrayCustomFieldsContact: string[] = Object.values(
            envCustomFieldContact
        );

        const filtredCustomFieldsContactInAmoCrm = customFieldsContact.filter(
            (el) => {
                return valuesArrayCustomFieldsContact.includes(el.name);
            }
        );

        const customFieldsContactInAmoCrmOnlyName =
            filtredCustomFieldsContactInAmoCrm.map((field) => field.name);

        const customFieldsContactNotInAmoCrm =
            valuesArrayCustomFieldsContact.filter((el) => {
                return !customFieldsContactInAmoCrmOnlyName.includes(el);
            });

        const maxValueSortContact = Math.max(
            ...customFieldsContact.map((el) => el.sort)
        );

        /* leads */
        const valuesArrayCustomFieldsLead: string[] =
            Object.values(envCustomFieldLead);

        const filtredCustomFieldsLeadInAmoCrm = customFieldsLead.filter(
            (el) => {
                return valuesArrayCustomFieldsLead.includes(el.name);
            }
        );

        const customFieldsLeadInAmoCrmOnlyName =
            filtredCustomFieldsLeadInAmoCrm.map((field) => field.name);

        const customFieldsLeadNotInAmoCrm =
            valuesArrayCustomFieldsContact.filter((el) => {
                return !customFieldsLeadInAmoCrmOnlyName.includes(el);
            });

        const maxValueSortLead = Math.max(
            ...customFieldsLead.map((el) => el.sort)
        );

        return {
            filtredCustomFieldsContactInAmoCrm,
            customFieldsContactNotInAmoCrm,
            maxValueSortContact,
            filtredCustomFieldsLeadInAmoCrm,
            customFieldsLeadNotInAmoCrm,
            maxValueSortLead,
        };
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    private async addCustomFieldsInAmoCrmAndDB({
        subdomain,
        accessToken,
    }: {
        subdomain: string;
        accessToken: string;
    }) {
        const {
            filtredCustomFieldsContactInAmoCrm,
            customFieldsContactNotInAmoCrm,
            maxValueSortContact,
            filtredCustomFieldsLeadInAmoCrm,
            customFieldsLeadNotInAmoCrm,
            maxValueSortLead,
        } = await this.checkCustomFieldsInAmoCrm({ subdomain, accessToken });

        const payloadContact = customFieldsContactNotInAmoCrm.map(
            (el, index) => {
                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                const type = (function () {
                    for (const [key, value] of Object.entries(
                        envCustomFieldContact
                    )) {
                        if (value === value) {
                            return envCustomFieldTypeContact[
                                key as keyof typeof envCustomFieldTypeContact
                            ];
                        }
                    }
                })() as string;
                return {
                    name: el,
                    type,
                    sort: maxValueSortContact + index,
                };
            }
        );

        const newCustomFieldsInAmoCrm = await this.createCustomFields({
            subdomain,
            accessToken,
            payload: payloadContact,
            pathQ: envPath.Path_For_Contacts_Custom_Fields,
        });

        [
            ...filtredCustomFieldsContactInAmoCrm,
            ...newCustomFieldsInAmoCrm,
        ].forEach(async (el) => {
            const payload = {
                fieldId: el.id,
                fieldType: el.type,
                fieldName: el.name,
                accountId: el.account_id,
            };
            await this.customFieldService.createCustomField(payload);
        });
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
