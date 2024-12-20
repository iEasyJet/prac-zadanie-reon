import { TPayloadContactCustomFields } from './payload-contact-custom-fields.type';

export type TPatchContactCustomFields = {
    subdomain: string;
    accessToken: string;
    payload: TPayloadContactCustomFields[];
    pathQ: string;
};
