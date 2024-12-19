import { FieldType } from '../enums/fieldType.enum';
import { ServicesFields } from './servicesFields';

const ServicesFieldsOnlyValue = Object.values(ServicesFields).map((el) => {
    return el.value;
});

export const LeadFields = {
    Services: {
        key: 'Services',
        value: 'Услуги',
        type: FieldType.multiselect,
        items: ServicesFieldsOnlyValue,
    },
};
