import { TContact } from './contact';

export type TBodyUpdateContact = {
    account: {
        subdomain: string;
        id: string;
        _links: {
            self: string;
        };
    };
    contacts: {
        update: TContact[];
    };
};
