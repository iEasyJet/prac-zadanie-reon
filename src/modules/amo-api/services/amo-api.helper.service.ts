import { Injectable } from '@nestjs/common';
import {
    TRequestRequiredCustomFields,
    TResponseRequiredCustomFields,
    TCreatePath,
} from '../types/types';

@Injectable()
export class AmoApiHelperService {
    constructor() {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public createPath({ subdomain, path }: TCreatePath): string {
        return [`https://${subdomain}`, ...path].join('/');
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public createHeaderAuthorization({ token }: { token: string }): string {
        return `Bearer ${token}`;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public checkRequiredCustomFieldsInAmoCustomFields({
        arrayFields,
        customFields,
    }: TRequestRequiredCustomFields): TResponseRequiredCustomFields {
        const existCustomFieldsInAmoCrm = customFields.filter((el) => {
            return arrayFields.includes(el.name);
        });
        const existCustomFieldsInAmoCrmOnlyName = existCustomFieldsInAmoCrm.map(
            (field) => field.name
        );
        const notExistCustomFieldsInAmoCrm = arrayFields.filter((el) => {
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
