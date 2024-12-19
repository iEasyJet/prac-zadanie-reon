import { TContact } from './contact';

export type TBodyAddContact = {
    account: {
        subdomain: string;
        id: string;
        _links: {
            self: string;
        };
    };
    contacts: {
        add: TContact[];
    };
};
