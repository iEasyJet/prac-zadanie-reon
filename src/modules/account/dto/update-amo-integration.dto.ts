import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateAccountDTO } from './create-account.dto';

export class UpdateAmoIntegrationDTO extends PartialType(
    OmitType(CreateAccountDTO, ['accountId'] as const)
) {}
