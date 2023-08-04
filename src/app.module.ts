import { Module } from '@nestjs/common';
import { PlatformModule } from './platform/platform.module';

@Module({
    imports: [PlatformModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
