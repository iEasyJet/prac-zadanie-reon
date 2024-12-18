import { Module } from '@nestjs/common';
import { CustomFieldRepository } from './custom-field.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomField, CustomFieldSchema } from './models/custom-field.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CustomField.name, schema: CustomFieldSchema },
        ]),
    ],
    providers: [CustomFieldRepository],
    exports: [CustomFieldRepository],
})
export class CustomFieldModule {}
