import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { envCustomField } from 'src/shared/env.enum';

@Schema()
export class CustomField {
    @Prop({ required: true })
    public fieldId: number;

    @Prop({ required: true })
    public fieldType: string;

    @Prop({ required: true, enum: envCustomField })
    public fieldName: envCustomField;

    @Prop({ required: true, unique: true })
    public accountId: number;
}

export const CustomFieldSchema = SchemaFactory.createForClass(CustomField);
export type CustomFieldDocument = HydratedDocument<CustomField>;
