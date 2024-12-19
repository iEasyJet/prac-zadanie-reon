import { TPayloadWebHook } from './payloadWebHook';

export type TAddWebHook = {
    subdomain: string;
    payload: TPayloadWebHook;
    pathQ: string;
    accessToken: string;
};
