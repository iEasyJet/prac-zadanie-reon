import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Account {
    @Prop({ required: true, unique: true })
    public accountId: number;

    @Prop({ required: true })
    public subdomain: string;

    @Prop({ required: true })
    public accessToken: string;

    @Prop({ required: true })
    public refreshToken: string;

    @Prop({ required: true })
    public isInstalled: boolean;

    @Prop({ required: true })
    public integration_id: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
export type AccountDocument = HydratedDocument<Account>;
