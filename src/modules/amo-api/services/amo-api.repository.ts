import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AmoApiHelper } from './amo-api.helper';
import { catchError, firstValueFrom } from 'rxjs';
import axios, { AxiosError } from 'axios';
import { EnvError } from '../enums/error.enum';
import { Endpoints } from 'src/shared/constants/endpoints';
import { Env } from 'src/shared/enums/env.enum';
import { Path } from 'src/shared/constants/path';
import { TRequestGetAccountInfo } from '../types/requestGetAccountInfo';
import { TAmoAccount } from '../types/amoAccount';
import { TResponseWithTokens } from '../types/responseWithTokens';
import { TQueryCustomField } from '../types/queryCustomField';
import { TGetCustomFields } from '../types/getCustomFields';
import { TFieldObject } from '../../../shared/types/fieldObject';
import { TCreateCustomFields } from '../types/createCustomFields';
import { TPatchContactCustomFields } from '../types/patchContactCustomFields';
import { GrantType } from 'src/shared/constants/grand-type';
import { TGetTokens } from '../types/getTokens';

@Injectable()
export class AmoApiRepository extends AmoApiHelper {
    private readonly logger = new Logger(AmoApiRepository.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        super();
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getAccountInfo({
        accessToken,
        subdomain,
    }: TRequestGetAccountInfo): Promise<TAmoAccount> {
        const path = this.createPath({
            subdomain,
            path: [Path.AccountData],
        });

        const header = this.createHeaderAuthorization({
            token: accessToken,
        });

        const { data: accountData } = await firstValueFrom(
            this.httpService.get<TAmoAccount>(path, header).pipe(
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

    public async getTokens({
        code,
        referer,
    }: TGetTokens): Promise<TResponseWithTokens> {
        const path = this.createPath({
            subdomain: referer,
            path: [Path.AccessToken],
        });

        const redirect_uri = `${this.configService.get(
            Env.RedirectURIWhenInstallIntegration
        )}/${Endpoints.AmoApi.Endpoint.AmoIntegration.AmoIntegration}/${Endpoints.AmoApi.Endpoint.AmoIntegration.Next.Add}`;

        const payload = {
            client_id: this.configService.get(Env.ClientID),
            client_secret: this.configService.get(Env.ClientSecret),
            grant_type: GrantType.AuthorizationCode,
            code,
            redirect_uri,
        };

        const { data: tokens }: { data: TResponseWithTokens } =
            await firstValueFrom(
                this.httpService.post(path, payload).pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(error.response?.data);
                        throw EnvError.PostAccessRefreshTokens;
                    })
                )
            );
        return tokens;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    public async updateToken({
        referer,
        refresh_token,
    }: TGetTokens): Promise<TResponseWithTokens> {
        const path = this.createPath({
            subdomain: referer,
            path: [Path.AccessToken],
        });

        const redirect_uri = `${this.configService.get(
            Env.RedirectURIWhenInstallIntegration
        )}/${Endpoints.AmoApi.Endpoint.AmoIntegration.AmoIntegration}/${Endpoints.AmoApi.Endpoint.AmoIntegration.Next.Add}`;

        const payload = {
            client_id: this.configService.get(Env.ClientID),
            client_secret: this.configService.get(Env.ClientSecret),
            grant_type: GrantType.RefreshToken,
            refresh_token: refresh_token,
            redirect_uri,
        };

        const { data: tokens }: { data: TResponseWithTokens } =
            await firstValueFrom(
                this.httpService.post(path, payload).pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(error.response?.data);
                        throw EnvError.PostAccessRefreshTokens;
                    })
                )
            );
        return tokens;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getCustomFields({
        subdomain,
        pathQ,
        accessToken,
    }: TGetCustomFields): Promise<TFieldObject[]> {
        const path = this.createPath({
            subdomain,
            path: [pathQ],
        });

        const header = this.createHeaderAuthorization({
            token: accessToken,
        });

        const {
            data: {
                _embedded: { custom_fields },
            },
        } = await firstValueFrom(
            this.httpService.get<TQueryCustomField>(path, header).pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error.response?.data);
                    throw EnvError.GetCustomFields;
                })
            )
        );

        return custom_fields;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async createCustomFields({
        subdomain,
        accessToken,
        payload,
        pathQ,
    }: TCreateCustomFields): Promise<TFieldObject[]> {
        const path = this.createPath({
            subdomain,
            path: [pathQ],
        });

        const headers = this.createHeaderAuthorization({
            token: accessToken,
        });

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
        const path = this.createPath({
            subdomain,
            path: [pathQ],
        });

        const headers = this.createHeaderAuthorization({
            token: accessToken,
        });

        await axios.patch(path, payload, headers);
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
