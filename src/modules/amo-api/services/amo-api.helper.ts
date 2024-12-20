import { TCreatePath } from '../types/create-path.type';
import { TResponseCreateHeader } from '../types/response-create-header.type';

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
