import { Injectable, NotFoundException } from '@nestjs/common';
import { Account, AccountDocument } from './models/account.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountDTO } from './dto/create-account.dto';
import { Endpoints } from 'src/shared/constants/endpoints';
import { envError } from './enums/errors.enum';
import {
    TAccount_ID,
    TOptionsWhereIntegrationInstall,
    TUpdateAccount,
} from './types/types';

@Injectable()
export class AccountRepository {
    constructor(
        @InjectModel(Account.name) private accountModel: Model<Account>
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getAccountByAccountId({
        accountId,
    }: TAccount_ID): Promise<AccountDocument> {
        const account = await this.accountModel.findOne({ accountId });
        if (!account) {
            throw new NotFoundException(envError.Not_Found);
        }
        return account;
    }
    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public createAccount(
        accountDto: CreateAccountDTO
    ): Promise<AccountDocument> {
        const account = new this.accountModel(accountDto);
        return account.save();
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async checkAccountByAccountId({
        accountId,
    }: TAccount_ID): Promise<boolean> {
        const account = await this.accountModel.findOne({ accountId });
        if (account) {
            return true;
        } else {
            return false;
        }
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async findAllAccountWhereIntegrationInstall({
        offset,
        limit,
    }: TOptionsWhereIntegrationInstall): Promise<
        Array<AccountDocument>
        // eslint-disable-next-line indent
    > {
        const accounts = await this.accountModel
            .find({
                isInstalled: Endpoints.Account.Install,
            })
            .skip(offset)
            .limit(limit)
            .exec();
        return accounts;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async updateAccount({
        accountId,
        accessToken,
        refreshToken,
        isInstalled,
    }: TUpdateAccount): Promise<AccountDocument> {
        const updatedAccount = await this.accountModel.findOneAndUpdate(
            { accountId },
            {
                accessToken,
                refreshToken,
                isInstalled,
            },
            { new: true }
        );

        if (!updatedAccount) {
            throw new NotFoundException(envError.Not_Found);
        }

        return updatedAccount;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async clearAccount({
        accountId,
    }: TAccount_ID): Promise<AccountDocument> {
        const updatedAccount = await this.accountModel.findOneAndUpdate(
            { accountId },
            {
                accessToken: null,
                refreshToken: null,
                isInstalled: Endpoints.Account.Uninstall,
            },
            { new: true }
        );

        if (!updatedAccount) {
            throw new NotFoundException(envError.Not_Found);
        }

        return updatedAccount;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
