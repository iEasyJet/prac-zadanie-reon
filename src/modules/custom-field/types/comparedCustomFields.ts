import { TFieldObject } from '../../../shared/types/fieldObject';

export type TComparedCustomFields = {
    existCustomFieldsInAmoCrm: TFieldObject[];
    notExistCustomFieldsInAmoCrm: {
        name: string;
        type: string;
    }[];
    sortMaxValue: number;
};
