import { TPayloadCustomField } from './payloadCustomField';

export type TCreateCustomFields = {
    subdomain: string;
    accessToken: string;
    payload: TPayloadCustomField[];
    pathQ: string;
};
