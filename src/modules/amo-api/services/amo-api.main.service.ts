import { Injectable } from '@nestjs/common';
import { AmoApiQueryService } from './amo-api.query.service';
import { AmoApiHelperService } from './amo-api.helper.service';
import { TFieldObject, TRequestAddCustomFields } from '../types/types';
import { CustomFieldRepository } from 'src/modules/custom-field/custom-field.repository';
import { Endpoints } from 'src/shared/constants/endpoints';

@Injectable()
export class AmoApiMainService {
    constructor(
        private readonly customFieldRepository: CustomFieldRepository,
        private readonly amoApiQueryService: AmoApiQueryService,
        private readonly amoApiHelper: AmoApiHelperService
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async addCustomFieldsInAmoCrmAndDBInstallIntegration({
        subdomain,
        accessToken,
    }: TRequestAddCustomFields): Promise<void> {
        /* Contact */
        const arrayOfEnumContact: string[] =
            Endpoints.AmoApi.CustomFields.Contact.Fields.map((el) => el.name);

        const {
            _embedded: { custom_fields: customFieldsContact },
        } = await this.amoApiQueryService.getCustomFields({
            subdomain,
            pathQ: Endpoints.AmoApi.Path.Contacts_Custom_Fields,
            accessToken,
        });

        const contactData =
            this.amoApiHelper.checkRequiredCustomFieldsInAmoCustomFields({
                arrayFields: arrayOfEnumContact,
                customFields: customFieldsContact,
            });

        let newCustomFieldsContactForAmo: TFieldObject[] = [];

        if (contactData.notExistCustomFieldsInAmoCrm.length) {
            const payloadContact = contactData.notExistCustomFieldsInAmoCrm.map(
                (el, index) => {
                    const type = (function (): string | undefined {
                        for (const field of Endpoints.AmoApi.CustomFields
                            .Contact.Fields) {
                            if (field.name === el) {
                                return field.type;
                            }
                        }
                    })() as string;
                    return {
                        name: el,
                        type,
                        sort: contactData.sortMaxValue + index + 1,
                    };
                }
            );

            newCustomFieldsContactForAmo =
                await this.amoApiQueryService.createCustomFields({
                    subdomain,
                    accessToken,
                    payload: payloadContact,
                    pathQ: Endpoints.AmoApi.Path.Contacts_Custom_Fields,
                });
        }

        const allFieldsContact = [
            ...contactData.existCustomFieldsInAmoCrm,
            ...newCustomFieldsContactForAmo,
        ];

        Promise.allSettled(
            allFieldsContact.map((el) => {
                const payload = {
                    fieldId: el.id,
                    fieldType: el.type,
                    fieldName: el.name,
                    accountId: el.account_id,
                    entityType: Endpoints.AmoApi.EntityType.Contact,
                };

                this.customFieldRepository.createCustomField(payload);
            })
        );

        /* Leads */
        const arrayOfEnumLead: string[] =
            Endpoints.AmoApi.CustomFields.Lead.Fields.map((el) => el.name);
        const {
            _embedded: { custom_fields: customFieldsLead },
        } = await this.amoApiQueryService.getCustomFields({
            subdomain,
            pathQ: Endpoints.AmoApi.Path.Leads_Custom_Fields,
            accessToken,
        });
        const leadData =
            this.amoApiHelper.checkRequiredCustomFieldsInAmoCustomFields({
                arrayFields: arrayOfEnumLead,
                customFields: customFieldsLead,
            });

        let newCustomFieldsLeadForAmo: TFieldObject[] = [];

        if (leadData.notExistCustomFieldsInAmoCrm.length) {
            const payloadLead = leadData.notExistCustomFieldsInAmoCrm.map(
                (el, index) => {
                    const type = (function (): string | undefined {
                        for (const field of Endpoints.AmoApi.CustomFields.Lead
                            .Fields) {
                            if (field.name === el) {
                                return field.type;
                            }
                        }
                    })() as string;

                    // Так как одно поле и нет больше примеров, то захаркодил
                    const enums = Endpoints.AmoApi.CustomFields.Lead.Fields.map(
                        (el, index) => {
                            return {
                                value: el,
                                sort: index + 1,
                            };
                        }
                    );

                    return {
                        name: el,
                        type,
                        sort: contactData.sortMaxValue + index + 1,
                        enums,
                    };
                }
            );
            console.log(payloadLead[0].enums);
            newCustomFieldsLeadForAmo =
                await this.amoApiQueryService.createCustomFields({
                    subdomain,
                    accessToken,
                    payload: payloadLead,
                    pathQ: Endpoints.AmoApi.Path.Leads_Custom_Fields,
                });
        }

        const allFieldsLead = [
            ...leadData.existCustomFieldsInAmoCrm,
            ...newCustomFieldsLeadForAmo,
        ];

        await Promise.allSettled(
            allFieldsLead.map((el) => {
                const payload = {
                    fieldId: el.id,
                    fieldType: el.type,
                    fieldName: el.name,
                    accountId: el.account_id,
                    entityType: Endpoints.AmoApi.EntityType.Lead,
                };
                this.customFieldRepository.createCustomField(payload);
            })
        );
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
