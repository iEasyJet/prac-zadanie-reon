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
import { envError, envGrantType, envOther, envPath } from 'src/shared/env.enum';
import { AxiosError } from 'axios';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class AmoApiService {
    private readonly logger = new Logger(AmoApiService.name);
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly accountService: AccountService
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    async installIntegration({
        responseWhenInstallWebHook,
    }: {
        responseWhenInstallWebHook: TResponseWhenInstallWebHook;
    }) {
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
        } catch (error) {
            throw new Error(error.message);
        }
    }
    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    async unInstallIntegration({ accountId }: { accountId: number }) {
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
    async getAccountInfo({
        accessToken,
        subdomain,
    }: {
        accessToken: string;
        subdomain: string;
    }): Promise<TResponseAccountData> {
        const { data: accountData } = await firstValueFrom(
            this.httpService
                .get<TResponseAccountData>(
                    this.createPath({
                        subdomain,
                        path: envPath.Path_For_Account_Data,
                    }),
                    {
                        headers: {
                            Authorization: this.createHeaderAuthorization({
                                token: accessToken,
                            }),
                        },
                    }
                )
                .pipe(
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
    async getAccessAndRefreshTokens({
        dataForGetTokens,
        grandType,
    }: {
        dataForGetTokens: TGetTokens;
        grandType: string;
    }): Promise<TResponseWithTokens> {
        try {
            const {
                data: accessAndRefreshTokens,
            }: { data: TResponseWithTokens } = await firstValueFrom(
                this.httpService
                    .post(
                        this.createPath({
                            subdomain: dataForGetTokens.referer,
                            path: envPath.Path_For_Access_Token,
                        }),
                        {
                            client_id: dataForGetTokens.client_id,
                            client_secret:
                                this.configService.get('CLIENT_SECRET'),
                            grant_type: grandType,
                            code: dataForGetTokens.code ?? undefined,
                            refresh_token:
                                dataForGetTokens.refresh_token ?? undefined,
                            redirect_uri: this.configService.get(
                                'REDIRECT_URI_WHEN_INSTALL_INTEGRATION'
                            ),
                        }
                    )
                    .pipe(
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
    }) {
        return `https://${subdomain}${path}`;
    }
    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    private createHeaderAuthorization({ token }: { token: string }) {
        return `${envOther.Bearer} ${token}`;
    }
    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
