import { IsEnum, IsNumber, IsString } from 'class-validator';
import { envCustomFieldContact } from 'src/shared/env.enum';

export class CreateCustomFieldDto {
    @IsNumber()
    public readonly fieldId: number;

    @IsString()
    public readonly fieldType: string;

    @IsEnum(envCustomFieldContact)
    public readonly fieldName: string;

    @IsNumber()
    public readonly accountId: number;

    @IsString()
    public readonly entityType: string;
}
