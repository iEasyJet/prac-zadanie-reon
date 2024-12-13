import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    CustomField,
    CustomFieldDocument,
} from './entities/custom-field.entity';
import { Model } from 'mongoose';
import { CreateCustomFieldDto } from './dto/create-cutom-field.dto';

@Injectable()
export class CustomFieldService {
    constructor(
        @InjectModel(CustomField.name)
        private customFieldModel: Model<CustomField>
    ) {}

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async getCustomFieldsByAccountId({
        accountId,
    }: {
        accountId: number;
    }): Promise<CustomFieldDocument[]> {
        try {
            const customFields = await this.customFieldModel.find({
                accountId,
            });

            return customFields;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async createCustomField(
        customFieldDto: CreateCustomFieldDto
    ): Promise<CustomFieldDocument> {
        try {
            const customField = new this.customFieldModel(customFieldDto);
            return customField.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async deleteCustomFieldByAccountId({
        accountId,
    }: {
        accountId: number;
    }): Promise<void> {
        try {
            await this.customFieldModel.deleteMany({
                accountId,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */

    public async findAllCustomFieldByAccountId({
        accountId,
    }: {
        accountId: number;
    }): Promise<Array<CustomFieldDocument>> {
        try {
            const customFields = await this.customFieldModel.find({
                accountId,
            });
            return customFields;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /* --------------------------------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
}
