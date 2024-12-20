import { FieldType } from '../enums/field-type.enum';

export type TReturnCreateFieldsObjectArray = {
    [x: string]: {
        name: string;
        type: FieldType;
        items?: string[];
    };
};
