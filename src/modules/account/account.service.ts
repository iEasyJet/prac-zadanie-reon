import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AccountRepository } from './account.repository';
import { AccountDocument } from './models/account.model';
import { AmoApiService } from '../amo-api/amo-api.service';
import { TAccountId } from './types/accountId';
import { TModelId } from './types/modelId';
import { TUpdateAccount } from './types/updateAccount';
import { CreateAccountDTO } from './dto/create-account.dto';

@Injectable()
export class AccountService {
    private readonly logger = new Logger(AccountService.name);

    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly amoApiService: AmoApiService
    ) {}

    /* '45 * * * * *' */
    /* CronExpression.EVERY_12_HOURS */

    @Cron(CronExpression.EVERY_12_HOURS)
    public async handleCron(): Promise<void> {
        this.logger.debug('Updated accounts tokens!');

        let offset = 0;
        let hasMoreAccounts = true;

        while (hasMoreAccounts) {
            const accounts =
                await this.accountRepository.findAllAccountWhereIntegrationInstall(
                    {
                        offset,
                    }
                );

            if (!accounts.length) {
                hasMoreAccounts = false;
                break;
            }

            await Promise.allSettled(
                accounts.map(
                    async (account) => await this.preparingAccountData(account)
                )
            );

            offset += this.accountRepository.findAccountsLimit;
        }
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    private async preparingAccountData(
        account: AccountDocument
    ): Promise<AccountDocument> {
        const updatedTokens = await this.amoApiService.updateToken({
            referer: account.subdomain,
            refresh_token: account.refreshToken,
        });

        return this.accountRepository.updateAccount(account.id, {
            accessToken: updatedTokens.access_token,
            refreshToken: updatedTokens.refresh_token,
        });
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async checkAccountByAccountId({
        accountId,
    }: TAccountId): Promise<boolean> {
        const answer = await this.accountRepository.checkAccountByAccountId({
            accountId,
        });

        return answer;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getAccountByAccountId({
        accountId,
    }: TAccountId): Promise<AccountDocument> {
        const account = await this.accountRepository.getAccountByAccountId({
            accountId,
        });

        return account;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async updateAccount(
        id: TModelId,
        { accessToken, refreshToken, isInstalled }: TUpdateAccount
    ): Promise<AccountDocument> {
        const updatedAccount = await this.accountRepository.updateAccount(id, {
            accessToken,
            refreshToken,
            isInstalled,
        });

        return updatedAccount;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async createAccount({
        accountDto,
    }: {
        accountDto: CreateAccountDTO;
    }): Promise<AccountDocument> {
        const account = await this.accountRepository.createAccount({
            accountDto,
        });

        return account;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async clearAccount({ id }: TModelId): Promise<AccountDocument> {
        const account = await this.accountRepository.clearAccount({
            id,
        });

        return account;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
