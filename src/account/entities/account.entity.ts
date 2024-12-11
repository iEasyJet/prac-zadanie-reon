import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Account {
    @Prop({ required: true, unique: true })
    accountId: number;

    @Prop({ required: true })
    subdomain: string;

    @Prop({ required: true })
    accessToken: string;

    @Prop({ required: true })
    refreshToken: string;

    @Prop({ required: true })
    isInstalled: boolean;

    @Prop({ required: true })
    integration_id: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
export type AccountDocument = HydratedDocument<Account>;
