export type TQueryCustomField = {
    _total_items: number;
    _page: number;
    _page_count: number;
    _links: {
        self: {
            href: string;
        };
    };
    _embedded: {
        custom_fields: TFieldObject[];
    };
};

export type TFieldObject = {
    id: number;
    name: string;
    code: string;
    sort: number;
    type: string;
    account_id: number;
    entity_type:
        | 'leads'
        | 'contacts'
        | 'companies'
        | 'segments'
        | 'customers'
        | 'catalogs';
    is_computed?: boolean;
    is_predefined?: boolean;
    is_deletable?: boolean;
    is_visible?: boolean;
    is_required?: boolean;
    settings?: unknown[];
    remind?: 'never' | 'day' | 'week' | 'month';
    currency?: string;
    enums?: EnumValue[];
    nested?: NestedValue[];
    is_api_only?: boolean;
    group_id?: string;
    required_statuses?: RequiredStatus[];
};

export type TQueryWhenInstallWebHook = {
    code: string;
    referer: string;
    platform: string;
    client_id: string;
    from_widget: string;
};

export type TQueryWhenUnInstallWebHook = {
    client_uuid: string;
    account_id: string;
    signature: string;
};

export type TAccount_ID = {
    accountId: number;
};

export type TCreatePath = {
    subdomain: string;
    path: string[];
};

export type TRequestRequiredCustomFields = {
    arrayFields: string[];
    customFields: TFieldObject[];
};

export type TResponseRequiredCustomFields = {
    existCustomFieldsInAmoCrm: TFieldObject[];
    notExistCustomFieldsInAmoCrm: string[];
    sortMaxValue: number;
};

export type TRequestAddCustomFields = {
    subdomain: string;
    accessToken: string;
};

export type TRequestGetAccountInfo = {
    accessToken: string;
    subdomain: string;
};

export type TResponseAccountData = {
    id: number;
    name: string;
    subdomain: string;
    current_user_id: number;
    country: string;
    customers_mode: string;
    is_unsorted_on: boolean;
    is_loss_reason_enabled: boolean;
    is_helpbot_enabled: boolean;
    is_technical_account: boolean;
    contact_name_display_order: number;
};

export type TGetTokens = {
    code?: string;
    referer: string;
    client_id: string;
    refresh_token?: string;
};

export type TResponseWithTokens = {
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
};

export type TRequestAccessAndRefreshTokens = {
    dataForGetTokens: TGetTokens;
    grandType: string;
};

export type TWebHookData = {
    id: number;
    created_by: number;
    created_at: number;
    updated_at: number;
    sort: number;
    disabled: boolean;
    destination: string;
    settings: string[];
};

export type TWebHook = {
    _total_items: number;
    _embedded: {
        webhooks: TWebHookData[];
    };
};

export type TGetWebHooks = {
    subdomain: string;
    pathQ: string;
    accessToken: string;
};

export type TCheckWebHooks = {
    webhooks: TWebHookData[];
};

export type TResponseCheckWebHooks = {
    path: string;
    name: string;
};

export type TAddWebHook = {
    subdomain: string;
    payload: {
        destination: string;
        settings: string[];
        sort?: number;
    };
    pathQ: string;
    accessToken: string;
};

type EnumValue = {
    id: number;
    value: string;
    sort: number;
    code?: string;
};

type NestedValue = {
    id: number;
    parent_id: number;
    value: string;
    sort: number;
};

type RequiredStatus = {
    status_id: number;
    pipeline_id: number;
};
