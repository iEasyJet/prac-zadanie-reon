import { TLinks } from '../../links/links.type';

export type TContact = {
    id: number;
    is_main: boolean;
    _links: TLinks;
};
