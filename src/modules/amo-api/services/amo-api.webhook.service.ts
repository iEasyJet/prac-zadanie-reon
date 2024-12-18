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
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/shared/env.enum';
import { Endpoints } from 'src/shared/constants/endpoints';

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
        const singleArrWebHookEndpoints = Object.values(
            Endpoints.AmoApi.Endpoint.WebHook
        );

        const asd = singleArrWebHookEndpoints.map((el, index) => {
            if (typeof el === 'string' && index === 0) {
                return el;
            }

            if (typeof el === 'object' && index !== 0) {
                const values = Object.values(el);
                return values;
            }
        });

        const listRequiredWebHooks = singleArrWebHookEndpoints.map((el) => {
            return {
                path: `${this.configService.get(
                    Env.RedirectURIWhenInstallIntegration
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
