import { ContactFields } from '../constants/contactFields';
import { LeadFields } from '../constants/leadFields';
import { ServicesFields } from '../constants/servicesFields';

export type TCreateFieldsObjectArray =
    | typeof ServicesFields
    | typeof ContactFields
    | typeof LeadFields;
