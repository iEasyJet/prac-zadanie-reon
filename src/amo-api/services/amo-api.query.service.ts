import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AmoApiHelperService } from './amo-api.helper.service';
import {
    TGetTokens,
    TResponseAccountData,
    TResponseWithTokens,
} from 'src/shared/types/types';
import { envError, envPath } from 'src/shared/env.enum';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { TFieldObject, TResponseCustomField } from '../types/types';

@Injectable()
export class AmoApiQueryService {
    private readonly logger = new Logger(AmoApiQueryService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly amoApiHelperService: AmoApiHelperService
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getAccountInfo({
        accessToken,
        subdomain,
    }: {
        accessToken: string;
        subdomain: string;
    }): Promise<TResponseAccountData> {
        const path = this.amoApiHelperService.createPath({
            subdomain,
            path: envPath.Path_For_Account_Data,
        });

        const header = {
            headers: {
                Authorization:
                    this.amoApiHelperService.createHeaderAuthorization({
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
            const path = this.amoApiHelperService.createPath({
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

    public async getCustomFields({
        subdomain,
        pathQ,
        accessToken,
    }: {
        subdomain: string;
        pathQ: string;
        accessToken: string;
    }): Promise<TResponseCustomField> {
        try {
            const path = this.amoApiHelperService.createPath({
                subdomain,
                path: pathQ,
            });

            const header = {
                headers: {
                    Authorization:
                        this.amoApiHelperService.createHeaderAuthorization({
                            token: accessToken,
                        }),
                },
            };

            const { data: customFields } = await firstValueFrom(
                this.httpService.get<TResponseCustomField>(path, header).pipe(
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

    public async createCustomFields({
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
            const path = this.amoApiHelperService.createPath({
                subdomain,
                path: pathQ,
            });

            const headers = {
                headers: {
                    Authorization:
                        this.amoApiHelperService.createHeaderAuthorization({
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
                    .post<TResponseCustomField>(path, payload, headers)
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
}
