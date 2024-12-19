import { Injectable } from '@nestjs/common';
import { TCreatePath } from '../types/createPath';
import { TResponseCreateHeader } from '../types/responseCreateHeader';

@Injectable()
export class AmoApiHelper {
    constructor() {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public createPath({ subdomain, path }: TCreatePath): string {
        return [`https://${subdomain}`, ...path].join('/');
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public createHeaderAuthorization({
        token,
    }: {
        token: string;
    }): TResponseCreateHeader {
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
