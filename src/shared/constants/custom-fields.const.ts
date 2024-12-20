import { TCreateFieldsObjectArray } from '../types/create-fields-object-array.type';
import { TReturnCreateFieldsObjectArray } from '../types/return-create-fields-object-array.type';
import { ContactFields } from './contact-fields.const';
import { LeadFields } from './lead-fields.const';
import { ServicesFields } from './services-fields.const';

function createFieldsObjectArray(
    obj: TCreateFieldsObjectArray
): TReturnCreateFieldsObjectArray {
    const arr = Object.values(obj).map((el) => {
        if ('items' in el) {
            return {
                [el.key]: {
                    name: el.value,
                    type: el.type,
                    items: el.items,
                },
            };
        } else {
            return {
                [el.key]: {
                    name: el.value,
                    type: el.type,
                },
            };
        }
    });

    return arr.reduce((acc, item) => {
        return { ...acc, ...item };
    }, {}) as TReturnCreateFieldsObjectArray;
}

export const CustomFields = {
    Contact: {
        Fields: {
            ...createFieldsObjectArray(ContactFields),
            ...createFieldsObjectArray(ServicesFields),
        },
    },
    Lead: {
        Fields: createFieldsObjectArray(LeadFields),
    },
};

export const CustomFieldsNames = [
    ...Object.values(ServicesFields).map((el) => el.value),
    ...Object.values(ContactFields).map((el) => el.value),
    ...Object.values(LeadFields).map((el) => el.value),
];

export const enumFieldName = new Set([...CustomFieldsNames]);
