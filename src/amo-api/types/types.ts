export type TResponseCustomFeild = {
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
    settings?: any[];
    remind?: 'never' | 'day' | 'week' | 'month';
    currency?: string;
    enums?: EnumValue[];
    nested?: NestedValue[];
    is_api_only?: boolean;
    group_id?: string;
    required_statuses?: RequiredStatus[];
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
