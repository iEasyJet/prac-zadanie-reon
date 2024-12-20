import { TFieldObject } from '../../../shared/types/field-object.type';

export type TComparedCustomFields = {
    existCustomFieldsInAmoCrm: TFieldObject[];
    notExistCustomFieldsInAmoCrm: {
        name: string;
        type: string;
    }[];
    sortMaxValue: number;
};
