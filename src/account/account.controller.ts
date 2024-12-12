import { Controller } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('amo-integration')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}
}
