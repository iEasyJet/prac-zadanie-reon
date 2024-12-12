import { Module } from '@nestjs/common';
import { CustomFieldService } from './custom-field.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomField, CustomFieldSchema } from './entities/custom-field.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CustomField.name, schema: CustomFieldSchema },
        ]),
    ],
    providers: [CustomFieldService],
    exports: [CustomFieldService],
})
export class CustomFieldModule {}
