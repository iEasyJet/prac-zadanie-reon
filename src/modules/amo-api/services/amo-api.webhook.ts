import { Injectable } from '@nestjs/common';
import { AmoApiHelper } from './amo-api.helper';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/shared/enums/env.enum';
import { Endpoints } from 'src/shared/constants/endpoints.const';
import { TWebHookData } from '../types/webhook-data.type';
import { TGetWebHooks } from '../types/get-webhooks.type';
import { TWebHook } from '../types/webhook.type';
import { TAddWebHook } from '../types/add-webhook.type';
import { TCheckWebHooks } from '../types/check-webhooks.type';
import { TResponseCheckWebHooks } from '../types/response-check-webhooks.type';

@Injectable()
export class AmoApiWebHook extends AmoApiHelper {
    constructor(private readonly configService: ConfigService) {
        super();
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getWebHooks({
        subdomain,
        pathQ,
        accessToken,
    }: TGetWebHooks): Promise<TWebHookData[]> {
        const path = this.createPath({
            subdomain,
            path: [pathQ],
        });

        const header = this.createHeaderAuthorization({
            token: accessToken,
        });

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
        const path = this.createPath({
            subdomain,
            path: [pathQ],
        });

        const header = this.createHeaderAuthorization({
            token: accessToken,
        });

        await axios.post<TWebHookData>(path, payload, header);
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async checkWebHooksNotInstall({
        webhooks,
    }: TCheckWebHooks): Promise<TResponseCheckWebHooks[]> {
        const singleArrWebHookEndpoints = [
            {
                path: [
                    this.configService.get(
                        Env.RedirectURIWhenInstallIntegration
                    ),
                    Endpoints.AmoApi.Endpoint.WebHook.WebHook,
                    Endpoints.AmoApi.Endpoint.WebHook.Contact.Contact,
                    Endpoints.AmoApi.Endpoint.WebHook.Contact.Next.Add,
                ].join('/'),
                name: Endpoints.AmoApi.Endpoint.WebHook.Contact.Amo.Add,
            },
            {
                path: [
                    this.configService.get(
                        Env.RedirectURIWhenInstallIntegration
                    ),
                    Endpoints.AmoApi.Endpoint.WebHook.WebHook,
                    Endpoints.AmoApi.Endpoint.WebHook.Contact.Contact,
                    Endpoints.AmoApi.Endpoint.WebHook.Contact.Next.Update,
                ].join('/'),
                name: Endpoints.AmoApi.Endpoint.WebHook.Contact.Amo.Update,
            },
            {
                path: [
                    this.configService.get(
                        Env.RedirectURIWhenInstallIntegration
                    ),
                    Endpoints.AmoApi.Endpoint.WebHook.WebHook,
                    Endpoints.AmoApi.Endpoint.WebHook.Lead.Lead,
                    Endpoints.AmoApi.Endpoint.WebHook.Lead.Next.Add,
                ].join('/'),
                name: Endpoints.AmoApi.Endpoint.WebHook.Lead.Amo.Add,
            },
            {
                path: [
                    this.configService.get(
                        Env.RedirectURIWhenInstallIntegration
                    ),
                    Endpoints.AmoApi.Endpoint.WebHook.WebHook,
                    Endpoints.AmoApi.Endpoint.WebHook.Lead.Lead,
                    Endpoints.AmoApi.Endpoint.WebHook.Lead.Next.Update,
                ].join('/'),
                name: Endpoints.AmoApi.Endpoint.WebHook.Lead.Amo.Update,
            },
        ];

        const isNotExistWebHooks = singleArrWebHookEndpoints.filter((el) => {
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
