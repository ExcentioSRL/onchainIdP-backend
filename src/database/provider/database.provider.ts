import * as mongoose from 'mongoose';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: (): Promise<typeof mongoose> =>
            mongoose.connect(
                'mongodb://root:example@localhost:27017/?authMechanism=DEFAULT',
            ),
    },
];
