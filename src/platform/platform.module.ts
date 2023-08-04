import { Module } from '@nestjs/common';
import { PlatformController } from './controller/platform.controller';
import { PlatformService } from './service/platform.service';
import { DatabaseModule } from 'src/database/database.module';
import { platformProviders } from './provider/platform.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [PlatformController],
    providers: [PlatformService, ...platformProviders],
})
export class PlatformModule { }