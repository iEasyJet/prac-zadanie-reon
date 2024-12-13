import { Injectable } from '@nestjs/common';
import { envOther } from 'src/shared/env.enum';
import { TFieldObject } from '../types/types';

@Injectable()
export class AmoApiHelperService {
    constructor() {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public createPath({
        subdomain,
        path,
    }: {
        subdomain: string;
        path: string;
    }): string {
        return `https://${subdomain}${path}`;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public createHeaderAuthorization({ token }: { token: string }): string {
        return `${envOther.Bearer} ${token}`;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public checkRequiredCustomFieldsInAmoCustomFields({
        enumArray,
        customFields,
    }: {
        enumArray: string[];
        customFields: TFieldObject[];
    }): {
        existCustomFieldsInAmoCrm: TFieldObject[];
        notExistCustomFieldsInAmoCrm: string[];
        sortMaxValue: number;
    } {
        const existCustomFieldsInAmoCrm = customFields.filter((el) => {
            return enumArray.includes(el.name);
        });
        const existCustomFieldsInAmoCrmOnlyName = existCustomFieldsInAmoCrm.map(
            (field) => field.name
        );
        const notExistCustomFieldsInAmoCrm = enumArray.filter((el) => {
            return !existCustomFieldsInAmoCrmOnlyName.includes(el);
        });
        const sortMaxValue = Math.max(...customFields.map((el) => el.sort));

        return {
            existCustomFieldsInAmoCrm,
            notExistCustomFieldsInAmoCrm,
            sortMaxValue,
        };
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
