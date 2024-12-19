import { Injectable, NotFoundException } from '@nestjs/common';
import { Account, AccountDocument } from './models/account.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountDTO } from './dto/create-account.dto';
import { EnvError } from './enums/errors.enum';
import { TAccountId } from './types/accountId';
import { TOptionsWhereIntegrationInstall } from './types/optionsWhereIntegrationInstall';
import { TModelId } from './types/modelId';
import { TUpdateAccount } from './types/updateAccount';
import { AccountSettings } from 'src/shared/constants/account-settings';

@Injectable()
export class AccountRepository {
    public findAccountsLimit = 5;

    constructor(
        @InjectModel(Account.name) private accountModel: Model<Account>
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getAccountByAccountId({
        accountId,
    }: TAccountId): Promise<AccountDocument> {
        const account = await this.accountModel.findOne({ accountId });
        if (!account) {
            throw new NotFoundException(EnvError.Not_Found);
        }

        return account;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async createAccount({
        accountDto,
    }: {
        accountDto: CreateAccountDTO;
    }): Promise<AccountDocument> {
        const account = new this.accountModel(accountDto);
        return await account.save();
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async checkAccountByAccountId({
        accountId,
    }: TAccountId): Promise<boolean> {
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
    }: TOptionsWhereIntegrationInstall): Promise<
        Array<AccountDocument>
        // eslint-disable-next-line indent
    > {
        const accounts = await this.accountModel
            .find({
                isInstalled: AccountSettings.Install,
            })
            .skip(offset)
            .limit(this.findAccountsLimit)
            .exec();
        return accounts;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async updateAccount(
        id: TModelId,
        { accessToken, refreshToken, isInstalled }: TUpdateAccount
    ): Promise<AccountDocument> {
        const updatedAccount = await this.accountModel.findByIdAndUpdate(
            id,
            {
                accessToken,
                refreshToken,
                isInstalled,
            },
            { new: true }
        );

        if (!updatedAccount) {
            throw new NotFoundException(EnvError.Not_Found);
        }

        return updatedAccount;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async clearAccount({ id }: TModelId): Promise<AccountDocument> {
        const updatedAccount = await this.accountModel.findByIdAndUpdate(
            id,
            {
                accessToken: null,
                refreshToken: null,
                isInstalled: AccountSettings.Uninstall,
            },
            { new: true }
        );

        if (!updatedAccount) {
            throw new NotFoundException(EnvError.Not_Found);
        }

        return updatedAccount;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
