import { TWebHookData } from './webhook-data.type';

export type TWebHook = {
    _total_items: number;
    _embedded: {
        webhooks: TWebHookData[];
    };
};
