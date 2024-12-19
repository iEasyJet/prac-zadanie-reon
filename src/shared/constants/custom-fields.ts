import { TCreateFieldsObjectArray } from '../types/createFieldsObjectArray';
import { TReturnCreateFieldsObjectArray } from '../types/returnCreateFieldsObjectArray';
import { ContactFields } from './contactFields';
import { LeadFields } from './leadFields';
import { ServicesFields } from './servicesFields';

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
