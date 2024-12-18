import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Endpoints } from 'src/shared/constants/endpoints';

const enumFieldName = new Set(
    ...Endpoints.AmoApi.CustomFields.Contact.Fields.map((el) => el.name),
    ...Endpoints.AmoApi.CustomFields.Lead.Fields.map((el) => el.name)
);

export class CreateCustomFieldDTO {
    @IsNumber()
    public readonly fieldId: number;

    @IsString()
    public readonly fieldType: string;

    @IsEnum(enumFieldName)
    public readonly fieldName: string;

    @IsNumber()
    public readonly accountId: number;

    @IsString()
    public readonly entityType: string;
}
