import { IsIn, IsNumber, IsString } from 'class-validator';
import { enumFieldName } from 'src/shared/constants/custom-fields';

export class CreateCustomFieldDTO {
    @IsNumber()
    public readonly fieldId: number;

    @IsString()
    public readonly fieldType: string;

    @IsIn([...enumFieldName])
    public readonly fieldName: string;

    @IsNumber()
    public readonly accountId: number;

    @IsString()
    public readonly entityType: string;
}
