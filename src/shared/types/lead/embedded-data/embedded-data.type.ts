import { TCatalogElement } from './catalog-element/catalog-element.type';
import { TCompany } from './company/company.types';

import { TContact } from './contact/contact.type';
import { TLossReason } from './loss-reason/loss-reason.type';
import { TTag } from './tag/tag.type';

export type TEmbeddedData = {
    loss_reason?: TLossReason;
    tags: TTag[];
    contacts?: TContact[];
    companies: TCompany[];
    catalog_elements?: TCatalogElement[];
};
