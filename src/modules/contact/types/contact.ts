import { TCustomFields } from './customFields';

export type TContact = {
    id: string;
    name: string;
    responsible_user_id: string;
    date_create: string;
    last_modified: string;
    created_user_id: string;
    modified_user_id: string;
    account_id: string;
    custom_fields: TCustomFields[];
    created_at: string;
    updated_at: string;
    type: string;
};
