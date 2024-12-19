import { forwardRef, Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { AmoApiModule } from '../amo-api/amo-api.module';
import { AccountModule } from '../account/account.module';

@Module({
    controllers: [ContactController],
    providers: [ContactService],
    imports: [forwardRef(() => AmoApiModule), forwardRef(() => AccountModule)],
})
export class ContactModule {}
