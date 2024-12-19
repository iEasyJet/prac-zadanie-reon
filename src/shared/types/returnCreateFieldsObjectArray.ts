import { FieldType } from '../enums/fieldType.enum';

export type TReturnCreateFieldsObjectArray = {
    [x: string]: {
        name: string;
        type: FieldType;
        items?: string[];
    };
};
