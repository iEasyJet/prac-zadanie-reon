export type TPayloadContactCustomFields = {
    id: number;
    custom_fields_values: {
        field_id: number;
        values: { value: string | number }[];
    }[];
};
