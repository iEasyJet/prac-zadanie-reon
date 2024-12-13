import { Injectable } from '@nestjs/common';
import { CustomFieldService } from 'src/custom-field/custom-field.service';
import { AmoApiQueryService } from './amo-api.query.service';
import { AmoApiHelperService } from './amo-api.helper.service';
import {
    envCustomFieldContact,
    envCustomFieldLead,
    envCustomFieldTypeContact,
    envCustomFieldTypeLead,
    envEntityType,
    envPath,
    envServicesMultiSelect,
} from 'src/shared/env.enum';
import { TFieldObject } from '../types/types';

@Injectable()
export class AmoApiMainService {
    constructor(
        private readonly customFieldService: CustomFieldService,
        private readonly amoApiQueryService: AmoApiQueryService,
        private readonly amoApiHelper: AmoApiHelperService
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async addCustomFieldsInAmoCrmAndDBInstallIntegration({
        subdomain,
        accessToken,
    }: {
        subdomain: string;
        accessToken: string;
    }) {
        try {
            /* Contact */
            const arrayOfEnumContact: string[] = Object.values(
                envCustomFieldContact
            );
            const {
                _embedded: { custom_fields: customFieldsContact },
            } = await this.amoApiQueryService.getCustomFields({
                subdomain,
                pathQ: envPath.Path_For_Contacts_Custom_Fields,
                accessToken,
            });
            const contactData =
                this.amoApiHelper.checkRequiredCustomFieldsInAmoCustomFields({
                    enumArray: arrayOfEnumContact,
                    customFields: customFieldsContact,
                });

            let newCustomFieldsContactForAmo: TFieldObject[] = [];

            if (contactData.notExistCustomFieldsInAmoCrm.length > 0) {
                const payloadContact =
                    contactData.notExistCustomFieldsInAmoCrm.map(
                        (el, index) => {
                            const type = (function () {
                                for (const [key, value] of Object.entries(
                                    envCustomFieldContact
                                )) {
                                    if (value === el) {
                                        return envCustomFieldTypeContact[
                                            key as keyof typeof envCustomFieldTypeContact
                                        ];
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
                        pathQ: envPath.Path_For_Contacts_Custom_Fields,
                    });
            }
            [
                ...contactData.existCustomFieldsInAmoCrm,
                ...newCustomFieldsContactForAmo,
            ].forEach(async (el) => {
                const payload = {
                    fieldId: el.id,
                    fieldType: el.type,
                    fieldName: el.name,
                    accountId: el.account_id,
                    entityType: envEntityType.Contacts,
                };

                await this.customFieldService.createCustomField(payload);
            });

            /* Leads */
            const arrayOfEnumLead: string[] = Object.values(envCustomFieldLead);
            const {
                _embedded: { custom_fields: customFieldsLead },
            } = await this.amoApiQueryService.getCustomFields({
                subdomain,
                pathQ: envPath.Path_For_Leads_Custom_Fields,
                accessToken,
            });
            const leadData =
                this.amoApiHelper.checkRequiredCustomFieldsInAmoCustomFields({
                    enumArray: arrayOfEnumLead,
                    customFields: customFieldsLead,
                });

            let newCustomFieldsLeadForAmo: TFieldObject[] = [];

            if (leadData.notExistCustomFieldsInAmoCrm.length > 0) {
                const payloadLead = leadData.notExistCustomFieldsInAmoCrm.map(
                    (el, index) => {
                        const type = (function () {
                            for (const [key, value] of Object.entries(
                                envCustomFieldLead
                            )) {
                                if (value === el) {
                                    const type =
                                        envCustomFieldTypeLead[
                                            key as keyof typeof envCustomFieldTypeLead
                                        ];

                                    return type;
                                }
                            }
                        })() as string;

                        /* Так как одно поле и нет больше примеров, то захаркодил */
                        const enums = Object.values(envServicesMultiSelect).map(
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

                newCustomFieldsLeadForAmo =
                    await this.amoApiQueryService.createCustomFields({
                        subdomain,
                        accessToken,
                        payload: payloadLead,
                        pathQ: envPath.Path_For_Leads_Custom_Fields,
                    });
            }
            [
                ...leadData.existCustomFieldsInAmoCrm,
                ...newCustomFieldsLeadForAmo,
            ].forEach(async (el) => {
                const payload = {
                    fieldId: el.id,
                    fieldType: el.type,
                    fieldName: el.name,
                    accountId: el.account_id,
                    entityType: envEntityType.Leads,
                };
                await this.customFieldService.createCustomField(payload);
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
