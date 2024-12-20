import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { AmoApiModule } from '../amo-api/amo-api.module';
import { AccountModule } from '../account/account.module';

@Module({
    imports: [AmoApiModule, AccountModule],
    providers: [LeadService],
    controllers: [LeadController],
})
export class LeadModule {}

