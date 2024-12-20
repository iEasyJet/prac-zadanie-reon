import { forwardRef, Module } from '@nestjs/common';
import { CustomFieldRepository } from './custom-field.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomField, CustomFieldSchema } from './models/custom-field.model';
import { CustomFieldService } from './custom-field.service';
import { AmoApiModule } from '../amo-api/amo-api.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CustomField.name, schema: CustomFieldSchema },
        ]),
        forwardRef(() => AmoApiModule),
    ],
    providers: [CustomFieldService, CustomFieldRepository],
    exports: [CustomFieldService],
})
export class CustomFieldModule {}
