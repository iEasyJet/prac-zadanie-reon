import { TFieldObject } from '../../../shared/types/fieldObject';

export type TQueryCustomField = {
    _total_items: number;
    _page: number;
    _page_count: number;
    _links: {
        self: {
            href: string;
        };
    };
    _embedded: {
        custom_fields: TFieldObject[];
    };
};
