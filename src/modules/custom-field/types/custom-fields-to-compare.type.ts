import { TFieldObject } from '../../../shared/types/field-object.type';

export type TCustomFieldsToCompare = {
    arrayFields: { name: string; type: string }[];
    customFields: TFieldObject[];
};
