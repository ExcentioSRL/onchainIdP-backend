import { Connection } from 'mongoose';
import { PlatformSchema } from '../schemas/platform.schema';

export const platformProviders = [
    {
        provide: 'PLATFORM_MODEL',
        useFactory: (connection: Connection) =>
            connection.model('Platform', PlatformSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
