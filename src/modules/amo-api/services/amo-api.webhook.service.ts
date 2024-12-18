import { Injectable } from '@nestjs/common';
import { AmoApiHelperService } from './amo-api.helper.service';
import axios from 'axios';
import {
    TAddWebHook,
    TCheckWebHooks,
    TGetWebHooks,
    TResponseCheckWebHooks,
    TWebHook,
    TWebHookData,
} from '../types/types';
import { Endpoints } from 'src/shared/constants/endpoints';
import { ConfigService } from '@nestjs/config';
import { env } from 'src/shared/env.enum';

@Injectable()
export class AmoApiWebHookService {
    constructor(
        private readonly amoApiHelperService: AmoApiHelperService,
        private readonly configService: ConfigService
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getWebHooks({
        subdomain,
        pathQ,
        accessToken,
    }: TGetWebHooks): Promise<TWebHookData[]> {
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

        const {
            data: {
                _embedded: { webhooks },
            },
        } = await axios.get<TWebHook>(path, header);
        return webhooks;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async addWebHook({
        subdomain,
        payload,
        pathQ,
        accessToken,
    }: TAddWebHook): Promise<void> {
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

        await axios.post<TWebHookData>(path, payload, header);
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async checkWebHooksNotInstall({
        webhooks,
    }: TCheckWebHooks): Promise<TResponseCheckWebHooks[]> {
        const listRequiredWebHooks = Object.values(
            Endpoints.AmoApi.WebHookEvents
        ).map((el) => {
            return {
                path: `${this.configService.get(
                    env.Redirect_Uri_When_Install_integration
                )}/${el}`,
                name: el,
            };
        });

        const isNotExistWebHooks = listRequiredWebHooks.filter((el) => {
            return !webhooks.some((hooks) => {
                return (
                    hooks.destination === el.path &&
                    hooks.settings.includes(el.name)
                );
            });
        });

        return isNotExistWebHooks;
    }
}
