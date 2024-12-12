import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomFieldDto } from './create-cutom-field.dto';

export class UpdateCustomFieldDto extends PartialType(CreateCustomFieldDto) {}
