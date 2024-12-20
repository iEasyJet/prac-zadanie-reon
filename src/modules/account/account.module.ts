import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './models/account.model';
import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';
import { AmoApiModule } from '../amo-api/amo-api.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Account.name, schema: AccountSchema },
        ]),
        forwardRef(() => AmoApiModule),
    ],
    providers: [AccountRepository, AccountService],
    exports: [AccountService],
})
export class AccountModule {}
