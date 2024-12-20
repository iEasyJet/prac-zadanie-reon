import { forwardRef, Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { AmoApiModule } from '../amo-api/amo-api.module';
import { AccountModule } from '../account/account.module';

@Module({
    imports: [forwardRef(() => AmoApiModule), forwardRef(() => AccountModule)],
    controllers: [ContactController],
    providers: [ContactService],
})
export class ContactModule {}
