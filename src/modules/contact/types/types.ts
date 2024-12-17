export type TBodyAddContact = {
    account: {
        subdomain: string;
        id: string;
        _links: {
            self: string;
        };
    };
    contacts: {
        add: TContact[];
    };
};

export type TBodyUpdateContact = {
    account: {
        subdomain: string;
        id: string;
        _links: {
            self: string;
        };
    };
    contacts: {
        update: TContact[];
    };
};

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

export type TCustomFields = {
    id: string;
    name: string;
    values: (string | { value: string | number })[];
};

export type TAgeCalculation = { birthDay: number };

export type TAddOrUpdateContact = {
    contacts: TContact[];
    account: {
        subdomain: string;
        id: string;
        _links: {
            self: string;
        };
    };
};
