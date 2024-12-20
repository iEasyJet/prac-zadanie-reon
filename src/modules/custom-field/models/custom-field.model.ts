import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { enumFieldName } from 'src/shared/constants/custom-fields.const';

@Schema()
export class CustomField {
    @Prop({ required: true })
    public fieldId: number;

    @Prop({ required: true })
    public fieldType: string;

    @Prop({ required: true, enum: [...enumFieldName] })
    public fieldName: string;

    @Prop({ required: true })
    public accountId: number;

    @Prop({ required: true })
    public entityType: string;
}

export const CustomFieldSchema = SchemaFactory.createForClass(CustomField);
export type CustomFieldDocument = HydratedDocument<CustomField>;
