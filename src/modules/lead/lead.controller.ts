import { Body, Controller, Post } from '@nestjs/common';
import { Endpoints } from 'src/shared/constants/endpoints.const';
import { TLeadDTO } from './types/lead-dto.types';
import { LeadService } from './lead.service';

const update = `${Endpoints.AmoApi.Endpoint.WebHook.Lead.Lead}/${Endpoints.AmoApi.Endpoint.WebHook.Lead.Next.Update}`;

@Controller(Endpoints.AmoApi.Endpoint.WebHook.WebHook)
export class LeadController {
    constructor(private readonly leadService: LeadService) {}

    @Post(update)
    public async addLead(@Body() body: TLeadDTO): Promise<void> {
        await this.leadService.addOrUpdateLead({ body });

        /*         const leadsHaveCustomFieldsField = arrayLeads?.filter((lead) => {
            if ('custom_fields' in lead) {
                return lead;
            }
        });

        if (!leadsHaveCustomFieldsField?.length) {
            return;
        }

        const customFieldServices = Object.values(
            CustomFields.Lead.Fields
        ).filter((el) => el.name === 'Услуги' && el.type === 'multiselect')[0];

        const leadsHaveServiceInCustomFields =
            leadsHaveCustomFieldsField.filter((lead) => {
                return lead.custom_fields?.some((field) => {
                    return field.name === customFieldServices.name;
                });
            });

        // Кастомное поле Услуги не заполнено 
        if (!leadsHaveServiceInCustomFields.length) {
            return;
        } */

        /*         if (!arrayLeads) {
            return;
        }

        const newArrayOfLeads: any[] = [];
        // Получаем заново сделки с контактами 
        const all = 

        for (const result of all) {
            if (result.status === 'fulfilled') {
                console.log(result.value.data);
                mainContact.push({
                    leadCustomFields: result.value.data
                        .custom_fields_values as any,
                    mainContactId: result.value.data._embedded.contacts.filter(
                        (el) => {
                            return el.is_main;
                        }
                    )[0] as any,
                });
            } else {
                console.error(
                    `Ошибка при получении данных для лида: ${result.reason}`
                );
            }
        }*/
    }
}
