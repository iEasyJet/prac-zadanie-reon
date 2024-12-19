import { TEnumValue } from './enumValue';
import { TNestedValue } from '../../modules/amo-api/types/nestedValue';
import { TRequiredStatus } from '../../modules/amo-api/types/requiredStatus';
import { EntityType } from '../enums/entityType.enum';

export type TFieldObject = {
    id: number;
    name: string;
    code: string;
    sort: number;
    type: string;
    account_id: number;
    entity_type:
        | EntityType.Leads
        | EntityType.Contacts
        | EntityType.Companies
        | EntityType.Segments
        | EntityType.Customers
        | EntityType.Catalogs;
    is_computed?: boolean;
    is_predefined?: boolean;
    is_deletable?: boolean;
    is_visible?: boolean;
    is_required?: boolean;
    settings?: unknown[];
    remind?: 'never' | 'day' | 'week' | 'month';
    currency?: string;
    enums?: TEnumValue[];
    nested?: TNestedValue[];
    is_api_only?: boolean;
    group_id?: string;
    required_statuses?: TRequiredStatus[];
};
