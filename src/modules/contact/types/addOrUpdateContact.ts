import { TContact } from './contact';

export type TAddOrUpdateContact = {
    contacts: TContact[];
    account: {
        subdomain: string;
        id: string;
        _links: {
            self: string;
        };
    };
};
