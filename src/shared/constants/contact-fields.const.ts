import { FieldType } from '../enums/field-type.enum';

export const ContactFields = {
    DateOfBirth: {
        key: 'DateOfBirth',
        value: 'Дата рождения',
        type: FieldType.Date,
    },
    Age: {
        key: 'Age',
        value: 'Возраст',
        type: FieldType.Numeric,
    },
};
