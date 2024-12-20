import { TCustomFieldValue } from './custom-field-value/custom-field-value.type';
import { TEmbeddedData } from './embedded-data/embedded-data.type';

export type TLead = {
    id: number;
    name: string;
    price: number;
    responsible_user_id: number;
    group_id: number;
    status_id: number;
    pipeline_id: number;
    loss_reason_id: number | null;
    source_id: number | null;
    created_by: number;
    updated_by: number;
    closed_at: number | null;
    created_at: number;
    updated_at: number;
    closest_task_at: number | null;
    is_deleted: boolean;
    custom_fields_values: TCustomFieldValue[] | null;
    score: number | null;
    account_id: number;
    labor_cost: number;
    is_price_modified_by_robot: boolean;
    _embedded: TEmbeddedData;
};
