import { TPayloadContactCustomFields } from './payloadContactCustomFields';

export type TPatchContactCustomFields = {
    subdomain: string;
    accessToken: string;
    payload: TPayloadContactCustomFields[];
    pathQ: string;
};
