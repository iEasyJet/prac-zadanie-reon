import { TPayloadWebHook } from './payload-webhook.type';

export type TAddWebHook = {
    subdomain: string;
    payload: TPayloadWebHook;
    pathQ: string;
    accessToken: string;
};
