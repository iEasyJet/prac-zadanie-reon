import { TWebHookData } from './webHookData';

export type TWebHook = {
    _total_items: number;
    _embedded: {
        webhooks: TWebHookData[];
    };
};
