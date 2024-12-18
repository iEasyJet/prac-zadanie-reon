enum FieldType {
    numeric = 'numeric',
    date = 'date',
    multiselect = 'multiselect',
}

const ServicesFields = {
    LaserFacialRejuvenation: {
        key: 'LaserFacialRejuvenation',
        value: 'Лазерное омоложение лица',
        type: FieldType.numeric,
    },
    UltrasonicLifting: {
        key: 'UltrasonicLifting',
        value: 'Ультразвуковой лифтинг',
        type: FieldType.numeric,
    },
    LaserRemovalOfBloodVessels: {
        key: 'LaserRemovalOfBloodVessels',
        value: 'Лазерное удаление сосудов',
        type: FieldType.numeric,
    },
    CorrectionOfExpressionWrinkles: {
        key: 'CorrectionOfExpressionWrinkles',
        value: 'Коррекция мимических морщин',
        type: FieldType.numeric,
    },
    LaserHairRemoval: {
        key: 'LaserHairRemoval',
        value: 'Лазерная эпиляция',
        type: FieldType.numeric,
    },
};

const ContactFields = {
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

const ServicesFieldsOnlyValue = Object.values(ServicesFields).map((el) => {
    return el.value;
});

const LeadFields = {
    Services: {
        key: 'Services',
        value: 'Услуги',
        type: FieldType.multiselect,
        items: ServicesFieldsOnlyValue,
    },
};

type TCreateFieldsObjectArray =
    | typeof ServicesFields
    | typeof ContactFields
    | typeof LeadFields;

type TReturnCreateFieldsObjectArray = {
    [x: string]: {
        name: string;
        type: FieldType;
        items?: string[];
    };
};

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
