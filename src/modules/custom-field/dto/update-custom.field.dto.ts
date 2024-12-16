import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomFieldDTO } from './create-cutom-field.dto';

export class UpdateCustomFieldDto extends PartialType(CreateCustomFieldDTO) {}
