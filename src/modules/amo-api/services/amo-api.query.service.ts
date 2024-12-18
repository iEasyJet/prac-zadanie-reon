import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AmoApiHelperService } from './amo-api.helper.service';
import { catchError, firstValueFrom } from 'rxjs';
import axios, { AxiosError } from 'axios';
import {
    TCreateCustomFields,
    TFieldObject,
    TGetCustomFields,
    TPatchContactCustomFields,
    TQueryCustomField,
    TRequestAccessAndRefreshTokens,
    TRequestGetAccountInfo,
    TResponseAccountData,
    TResponseWithTokens,
} from '../types/types';
import { EnvError } from '../enums/error.enum';
import { Endpoints } from 'src/shared/constants/endpoints';
import { Env } from 'src/shared/env.enum';
import { Path } from 'src/shared/constants/path';

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
    }: TRequestGetAccountInfo): Promise<TResponseAccountData> {
        const path = this.amoApiHelperService.createPath({
            subdomain,
            path: [Path.AccountData],
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
                    throw EnvError.GetAccountData;
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
    }: TRequestAccessAndRefreshTokens): Promise<TResponseWithTokens> {
        const path = this.amoApiHelperService.createPath({
            subdomain: dataForGetTokens.referer,
            path: [Path.AccessToken],
        });

        const redirect_uri = `${this.configService.get(
            Env.RedirectURIWhenInstallIntegration
        )}/${Endpoints.AmoApi.Endpoint.AmoIntegration.AmoIntegration}/${Endpoints.AmoApi.Endpoint.AmoIntegration.Next.Add}`;

        const payload = {
            client_id: dataForGetTokens.client_id,
            client_secret: this.configService.get(Env.ClientSecret),
            grant_type: grandType,
            code: dataForGetTokens.code ?? undefined,
            refresh_token: dataForGetTokens.refresh_token ?? undefined,
            redirect_uri,
        };

        const { data: accessAndRefreshTokens }: { data: TResponseWithTokens } =
            await firstValueFrom(
                this.httpService.post(path, payload).pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(error.response?.data);
                        throw EnvError.PostAccessRefreshTokens;
                    })
                )
            );
        return accessAndRefreshTokens;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getCustomFields({
        subdomain,
        pathQ,
        accessToken,
    }: TGetCustomFields): Promise<TQueryCustomField> {
        const path = this.amoApiHelperService.createPath({
            subdomain,
            path: [pathQ],
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
            this.httpService.get<TQueryCustomField>(path, header).pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error.response?.data);
                    throw EnvError.GetCustomFields;
                })
            )
        );
        return customFields;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async createCustomFields({
        subdomain,
        accessToken,
        payload,
        pathQ,
    }: TCreateCustomFields): Promise<TFieldObject[]> {
        const path = this.amoApiHelperService.createPath({
            subdomain,
            path: [pathQ],
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
                .post<TQueryCustomField>(path, payload, headers)
                .pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(error.response?.data);
                        throw EnvError.PostCustomFields;
                    })
                )
        );
        return custom_fields;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async patchContactCustomFields({
        subdomain,
        accessToken,
        payload,
        pathQ,
    }: TPatchContactCustomFields): Promise<void> {
        const path = this.amoApiHelperService.createPath({
            subdomain,
            path: [pathQ],
        });

        const headers = {
            headers: {
                Authorization:
                    this.amoApiHelperService.createHeaderAuthorization({
                        token: accessToken,
                    }),
            },
        };

        await axios.patch(path, payload, headers);
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
