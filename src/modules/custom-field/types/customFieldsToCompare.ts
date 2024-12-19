import { TFieldObject } from '../../../shared/types/fieldObject';

export type TCustomFieldsToCompare = {
    arrayFields: { name: string; type: string }[];
    customFields: TFieldObject[];
};
