import { Injectable } from '@nestjs/common';
import { AmoApiQueryService } from '../amo-api/services/amo-api.query.service';
import { AccountRepository } from '../account/account.repository';
import { Endpoints } from 'src/shared/constants/endpoints';
import { Fields } from './enums/enum';
import { TAddOrUpdateContact, TAgeCalculation } from './types/types';

@Injectable()
export class ContactService {
    constructor(
        private readonly amoApiQueryService: AmoApiQueryService,
        private readonly accountRepository: AccountRepository
    ) {}

    public async addOrUpdateContact({
        account,
        contacts,
    }: TAddOrUpdateContact): Promise<void> {
        const contactsWhereBithDayIsNotEmpty = contacts.filter((contact) => {
            return contact.custom_fields?.some((field) => {
                return field.name === Fields.BirthDay;
            });
        });

        if (!contactsWhereBithDayIsNotEmpty.length) {
            return;
        }

        const accountData = await this.accountRepository.getAccountByAccountId({
            accountId: Number(account.id),
        });

        const customFieldsContact =
            await this.amoApiQueryService.getCustomFields({
                subdomain: accountData.subdomain,
                pathQ: Endpoints.AmoApi.Path.Contacts_Custom_Fields,
                accessToken: accountData.accessToken,
            });

        const ageField = customFieldsContact._embedded.custom_fields.filter(
            (field) => {
                return field.name === Fields.Age;
            }
        );

        if (!ageField.length) {
            return;
        }

        const payload = contactsWhereBithDayIsNotEmpty
            .map((concat) => {
                const birthDayFieldValue =
                    Number(
                        concat.custom_fields.filter((field) => {
                            return field.name === Fields.BirthDay;
                        })[0].values[0]
                    ) * 1000;

                const age = this.ageCalculation({
                    birthDay: birthDayFieldValue,
                });

                const ageFieldContact = concat.custom_fields.filter((field) => {
                    return field.name === Fields.Age;
                });

                if (!ageFieldContact.length) {
                    const values = [{ value: age }];

                    return {
                        id: Number(concat.id),
                        custom_fields_values: [
                            {
                                field_id: Number(ageField[0].id),
                                values,
                            },
                        ],
                    };
                } else {
                    const firstValue = ageFieldContact[0].values[0];
                    let value: string | number;

                    if (typeof firstValue === 'object' && firstValue !== null) {
                        value = firstValue.value;
                    } else {
                        value = firstValue;
                    }
                    console.log(value, age);
                    if (Number(value) !== age) {
                        const values = [{ value: age }];

                        return {
                            id: Number(concat.id),
                            custom_fields_values: [
                                {
                                    field_id: Number(ageField[0].id),
                                    values,
                                },
                            ],
                        };
                    }
                }
            })
            .filter((el) => el !== undefined);

        if (payload.length) {
            await this.amoApiQueryService.patchContactCustomFields({
                subdomain: accountData.subdomain,
                accessToken: accountData.accessToken,
                payload,
                pathQ: Endpoints.AmoApi.Path.Contact,
            });
        }
    }

    private ageCalculation({ birthDay }: TAgeCalculation): number {
        const millisecInOneYear = 31536000000;
        const now = Date.now();
        return Math.floor((now - birthDay) / millisecInOneYear);
    }
}
