import * as mongoose from 'mongoose';

export const databaseService = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: (): Promise<typeof mongoose> => mongoose.connect('mongodb://localhost/nest'),
    },
];
