import { TPayloadCustomField } from './payload-custom-field.type';

export type TCreateCustomFields = {
    subdomain: string;
    accessToken: string;
    payload: TPayloadCustomField[];
    pathQ: string;
};
