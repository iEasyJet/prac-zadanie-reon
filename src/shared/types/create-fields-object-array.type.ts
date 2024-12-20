import { ContactFields } from '../constants/contact-fields.const';
import { LeadFields } from '../constants/lead-fields.const';
import { ServicesFields } from '../constants/services-fields.const';

export type TCreateFieldsObjectArray =
    | typeof ServicesFields
    | typeof ContactFields
    | typeof LeadFields;
