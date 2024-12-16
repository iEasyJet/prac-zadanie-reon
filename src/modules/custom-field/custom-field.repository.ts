import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CustomField, CustomFieldDocument } from './models/custom-field.model';
import { Model } from 'mongoose';
import { CreateCustomFieldDTO } from './dto/create-cutom-field.dto';
import { TRequestCustomFields, TAccount_ID } from './types/types';

@Injectable()
export class CustomFieldRepository {
    constructor(
        @InjectModel(CustomField.name)
        private customFieldModel: Model<CustomField>
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getCustomFieldsByAccountIdAndEntityType({
        accountId,
        entityType,
    }: TRequestCustomFields): Promise<CustomFieldDocument[]> {
        const customFields = await this.customFieldModel.find({
            accountId,
            entityType,
        });

        return customFields;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async createCustomField(
        customFieldDto: CreateCustomFieldDTO
    ): Promise<CustomFieldDocument> {
        const customField = new this.customFieldModel(customFieldDto);
        return customField.save();
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async deleteCustomFieldByAccountId({
        accountId,
    }: TAccount_ID): Promise<void> {
        await this.customFieldModel.deleteMany({
            accountId,
        });
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async findAllCustomFieldByAccountId({
        accountId,
    }: TAccount_ID): Promise<Array<CustomFieldDocument>> {
        const customFields = await this.customFieldModel.find({
            accountId,
        });
        return customFields;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async deleteCustomFieldsByAccountId({
        accountId,
    }: TAccount_ID): Promise<void> {
        await this.customFieldModel.deleteMany({ accountId });
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
