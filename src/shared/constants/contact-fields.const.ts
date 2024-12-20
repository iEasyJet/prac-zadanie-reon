import { FieldType } from '../enums/field-type.enum';

export const ContactFields = {
    DateOfBirth: {
        key: 'DateOfBirth',
        value: 'Дата рождения',
        type: FieldType.date,
    },
    Age: {
        key: 'Age',
        value: 'Возраст',
        type: FieldType.numeric,
    },
};
