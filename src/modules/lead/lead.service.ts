import { Injectable } from '@nestjs/common';
import { AmoApiService } from '../amo-api/amo-api.service';
import { CustomFields } from 'src/shared/constants/custom-fields.const';
import { Path } from 'src/shared/constants/path.const';
import { AccountService } from '../account/account.service';

import { TLeadDTO, TLeads } from './types/lead-dto.types';

@Injectable()
export class LeadService {
    constructor(
        private readonly amoApiService: AmoApiService,
        private readonly accountService: AccountService
    ) {}

    public async addOrUpdateLead({ body }: { body: TLeadDTO }): Promise<void> {
        let arrayLeads: TLeads[] = [];
        const { account, leads } = body;

        if ('add' in leads && Array.isArray(leads.add)) {
            arrayLeads = leads.add;
        }

        if ('update' in leads && Array.isArray(leads.update)) {
            arrayLeads = leads.update;
        }

        if (!arrayLeads.length) {
            return;
        }

        const requiredCustomFields = Object.values(CustomFields.Lead.Fields);

        // Отбираем пользователей, у которых есть нужные поля из массива выше
        const leadsHaveCustomFieldsServices = arrayLeads.filter((lead) => {
            if ('custom_fields' in lead) {
                return lead.custom_fields?.some((field) => {
                    return requiredCustomFields.some((cusField) => {
                        return cusField.name === field.name;
                    });
                });
            }
        });

        // Если нет то выходим
        if (!leadsHaveCustomFieldsServices.length) {
            return;
        }

        const accountData = await this.accountService.getAccountByAccountId({
            accountId: Number(account.id),
        });

        // Получаем полную информацию по лидам
        const fullLeadInfo = await Promise.allSettled(
            leadsHaveCustomFieldsServices.map((lead) => {
                const pathQ = [Path.Lead, `${String(lead.id)}?with=contacts`];
                return this.amoApiService.getLeadInfo({
                    subdomain: accountData.subdomain,
                    accessToken: accountData.accessToken,
                    pathQ,
                });
            })
        );

        // Успешыне данные за лидами
        const fulfilledLeads = fullLeadInfo.filter(
            (el) => el.status === 'fulfilled'
        );

        // Сверяем данные по имени и типу
        // const

        console.log('fullLeadInfo', fullLeadInfo);
    }
}
