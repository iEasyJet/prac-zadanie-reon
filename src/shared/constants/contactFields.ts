import { FieldType } from '../enums/fieldType.enum';

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
