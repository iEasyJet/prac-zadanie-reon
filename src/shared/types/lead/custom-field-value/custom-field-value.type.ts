import { FieldType } from 'src/shared/enums/field-type.enum';

export type TCustomFieldValue = {
    field_id: number;
    field_name: string;
    field_code: string | null;
    field_type: FieldType;
    values: TValues;
    is_computed: boolean;
};

export type TValues =
    | TChainedListValues
    | TMultiSelectValues
    | TTextValues
    | TNumericTypes
    | TCheckboxTypes
    | TSelectValues
    | TDateTypes
    | TUrlTypes;

type TChainedListValues = {
    catalog_id: number;
    catalog_element_id: number;
};

type TMultiSelectValues = {
    value: string;
    enum_id: number;
    enum_code: string | null;
};

type TTextValues = { value: string };

type TNumericTypes = { value: string };

type TCheckboxTypes = { value: boolean };

type TSelectValues = {
    value: string;
    enum_id: number;
    enum_code: string | null;
};

type TDateTypes = { value: number };

type TUrlTypes = { value: string };
