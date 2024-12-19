import { AmoApiService } from './../amo-api/amo-api.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CustomFieldRepository } from './custom-field.repository';
import { TAccountId } from './types/accountId';
import { CreateCustomFieldDTO } from './dto/create-cutom-field.dto';
import { CustomFieldDocument } from './models/custom-field.model';
import { TRequestAddCustomFields } from './types/requestAddCustomFields';
import { CustomFields } from 'src/shared/constants/custom-fields';
import { Path } from 'src/shared/constants/path';
import { TComparedCustomFields } from './types/comparedCustomFields';
import { TCustomFieldsToCompare } from './types/customFieldsToCompare';
import { TFieldObject } from '../../shared/types/fieldObject';
import { EntityType } from 'src/shared/constants/entity-type';

@Injectable()
export class CustomFieldService {
    constructor(
        private readonly customFieldRepository: CustomFieldRepository,
        @Inject(forwardRef(() => AmoApiService))
        private readonly amoApiService: AmoApiService
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async deleteCustomFieldsByAccountId({
        accountId,
    }: TAccountId): Promise<void> {
        await this.customFieldRepository.deleteCustomFieldsByAccountId({
            accountId,
        });
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async createCustomField({
        customFieldDto,
    }: {
        customFieldDto: CreateCustomFieldDTO;
    }): Promise<CustomFieldDocument> {
        return await this.customFieldRepository.createCustomField({
            customFieldDto,
        });
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async addCustomFieldsInAmoCrmAndDBInstallIntegration({
        subdomain,
        accessToken,
        whichField,
    }: TRequestAddCustomFields): Promise<void> {
        const settings = {
            Lead: {
                customFields: CustomFields.Lead.Fields,
                path: Path.LeadsCustomFields,
                entityType: EntityType.Lead,
            },
            Contact: {
                customFields: CustomFields.Contact.Fields,
                path: Path.ContactsCustomFields,
                entityType: EntityType.Contact,
            },
        };

        const arrayFields: { name: string; type: string }[] = Object.values(
            settings[whichField].customFields
        ).map((el) => {
            return { name: el.name, type: el.type };
        });

        const customFields = await this.amoApiService.getCustomFields({
            subdomain,
            pathQ: settings[whichField].path,
            accessToken,
        });

        const listFields = this.checkRequiredCustomFieldsInAmoCustomFields({
            arrayFields,
            customFields,
        });

        let newCustomFieldsForAmo: TFieldObject[] = [];

        if (listFields.notExistCustomFieldsInAmoCrm.length) {
            const payload = listFields.notExistCustomFieldsInAmoCrm.map(
                (el, index) => {
                    const fieldsByName = Object.values(
                        settings[whichField].customFields
                    ).filter((field) => {
                        return field.name === el.name;
                    })[0].items;

                    const enums = fieldsByName?.map((el, index) => {
                        return {
                            value: el,
                            sort: index + 1,
                        };
                    });

                    return {
                        name: el.name,
                        type: el.type,
                        sort: listFields.sortMaxValue + index + 1,
                        enums,
                    };
                }
            );

            newCustomFieldsForAmo = await this.amoApiService.createCustomFields(
                {
                    subdomain,
                    accessToken,
                    payload: payload,
                    pathQ: settings[whichField].path,
                }
            );
        }

        const allFields = [
            ...listFields.existCustomFieldsInAmoCrm,
            ...newCustomFieldsForAmo,
        ];

        await Promise.allSettled(
            allFields.map((el) => {
                const payload = {
                    fieldId: el.id,
                    fieldType: el.type,
                    fieldName: el.name,
                    accountId: el.account_id,
                    entityType: settings[whichField].entityType,
                };

                this.createCustomField({
                    customFieldDto: payload,
                });
            })
        );
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    private checkRequiredCustomFieldsInAmoCustomFields({
        arrayFields,
        customFields,
    }: TCustomFieldsToCompare): TComparedCustomFields {
        const existCustomFieldsInAmoCrm = customFields.filter((field1) => {
            return arrayFields.some(
                (field2) =>
                    field1.name === field2.name && field1.type === field2.type
            );
        });

        const notExistCustomFieldsInAmoCrm = arrayFields.filter((field1) => {
            return !existCustomFieldsInAmoCrm.some(
                (field2) =>
                    field2.name === field1.name && field1.type === field2.type
            );
        });
        const sortMaxValue = Math.max(...customFields.map((el) => el.sort));

        return {
            existCustomFieldsInAmoCrm,
            notExistCustomFieldsInAmoCrm,
            sortMaxValue,
        };
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
