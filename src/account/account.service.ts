import { Injectable } from '@nestjs/common';
import { Account, AccountDocument } from './entities/account.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { envError } from 'src/shared/env.enum';

@Injectable()
export class AccountService {
    constructor(
        @InjectModel(Account.name) private accountModel: Model<Account>
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    createAccount(accountDto: CreateAccountDto) {
        try {
            const account = new this.accountModel(accountDto);
            return account.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }
    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    async findAccountByAccountId({
        accountId,
    }: {
        accountId: number;
    }): Promise<boolean> {
        try {
            const account = await this.accountModel.findOne({ accountId });

            if (account) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    async findAllAccountWhereIntegrationInstall() {
        try {
            const accounts = await this.accountModel.find({
                isInstalled: true,
            });
            return accounts;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    async updateAccount({
        accountId,
        accessToken,
        refreshToken,
        isInstalled,
    }: {
        accountId: number;
        accessToken: string | null;
        refreshToken: string | null;
        isInstalled?: boolean;
    }): Promise<AccountDocument> {
        try {
            const updatedAccount = await this.accountModel.findOneAndUpdate(
                { accountId },
                {
                    accessToken,
                    refreshToken,
                    isInstalled: isInstalled,
                },
                { new: true }
            );

            if (!updatedAccount) {
                throw new Error(envError.Error_Account_Not_Found);
            }

            return updatedAccount as AccountDocument;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
