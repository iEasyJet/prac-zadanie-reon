import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CustomField, CustomFieldDocument } from './models/custom-field.model';
import { Model } from 'mongoose';
import { CreateCustomFieldDTO } from './dto/create-cutom-field.dto';
import { TAccountId } from './types/accountId';

@Injectable()
export class CustomFieldRepository {
    constructor(
        @InjectModel(CustomField.name)
        private customFieldModel: Model<CustomField>
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async createCustomField({
        customFieldDto,
    }: {
        customFieldDto: CreateCustomFieldDTO;
    }): Promise<CustomFieldDocument> {
        const customField = new this.customFieldModel(customFieldDto);
        return customField.save();
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async findAllCustomFieldByAccountId({
        accountId,
    }: TAccountId): Promise<Array<CustomFieldDocument>> {
        const customFields = await this.customFieldModel.find({
            accountId,
        });
        return customFields;
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async deleteCustomFieldsByAccountId({
        accountId,
    }: TAccountId): Promise<void> {
        await this.customFieldModel.deleteMany({ accountId });
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
