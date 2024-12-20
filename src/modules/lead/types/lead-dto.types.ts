import { TValues } from 'src/shared/types/lead/custom-field-value/custom-field-value.type';
import { TTag } from 'src/shared/types/lead/embedded-data/tag/tag.type';
import { TLinks } from 'src/shared/types/lead/links/links.type';

export type TLeadDTO = {
    account: {
        subdomain: string;
        id: string;
        _links: TLinks;
    };
    leads: {
        update?: TLeads[];
        add?: TLeads[];
    };
};

export type TLeads = {
    id: string;
    name: string;
    status_id: string;
    price: string;
    responsible_user_id: string;
    last_modified: string;
    modified_user_id: string;
    created_user_id: string;
    date_create: string;
    pipeline_id: string;
    tags: TTag[];
    account_id: string;
    custom_fields: TCustomFields[];
    created_at: string;
    updated_at: string;
};

type TCustomFields = {
    id: string;
    name: string;
    values: TValues;
};
