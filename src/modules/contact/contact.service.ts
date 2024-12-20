import { Injectable } from '@nestjs/common';
import { Fields } from './enums/fields.enum';
import { Path } from 'src/shared/constants/path.const';
import { TAddOrUpdateContact } from './types/add-or-update-contact.type';
import { TAgeCalculation } from './types/age-calculation.type';
import { AmoApiService } from '../amo-api/amo-api.service';
import { AccountService } from '../account/account.service';
import { MillisecondInOneYear } from './constants/millisecond-in-one-year.const';

@Injectable()
export class ContactService {
    constructor(
        private readonly amoApiService: AmoApiService,
        private readonly accountService: AccountService
    ) {}

    public async addOrUpdateContact({
        account,
        contacts,
    }: TAddOrUpdateContact): Promise<void> {
        const contactsWhereBirthDayIsNotEmpty = contacts.filter((contact) => {
            return contact.custom_fields?.some((field) => {
                return field.name === Fields.BirthDay;
            });
        });

        if (!contactsWhereBirthDayIsNotEmpty.length) {
            return;
        }

        const accountData = await this.accountService.getAccountByAccountId({
            accountId: Number(account.id),
        });

        const contactsCustomFields = await this.amoApiService.getCustomFields({
            subdomain: accountData.subdomain,
            pathQ: Path.ContactsCustomFields,
            accessToken: accountData.accessToken,
        });

        const ageField = contactsCustomFields.filter((field) => {
            return field.name === Fields.Age;
        });

        if (!ageField.length) {
            return;
        }

        const payload = contactsWhereBirthDayIsNotEmpty
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
            await this.amoApiService.patchContactCustomFields({
                subdomain: accountData.subdomain,
                accessToken: accountData.accessToken,
                payload,
                pathQ: Path.Contact,
            });
        }
    }

    private ageCalculation({ birthDay }: TAgeCalculation): number {
        const now = Date.now();
        return Math.floor((now - birthDay) / MillisecondInOneYear);
    }
}
