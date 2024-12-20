import { FieldType } from '../enums/field-type.enum';
import { ServicesFields } from './services-fields.const';

const ServicesFieldsOnlyValue = Object.values(ServicesFields).map((el) => {
    return el.value;
});

export const LeadFields = {
    Services: {
        key: 'Services',
        value: 'Услуги',
        type: FieldType.Multiselect,
        items: ServicesFieldsOnlyValue,
    },
};
