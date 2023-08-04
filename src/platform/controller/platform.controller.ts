import { Body, Controller, Get, Post } from '@nestjs/common';
import {
    PlatformInterface,
    PlatformService,
} from '../service/platform.service';
import { CreatePlatformDTO } from '../dto/create-platform.dto';

@Controller('platform')
export class PlatformController {
    constructor(private platformService: PlatformService) { }

    @Post()
    async create(@Body() createPlatform: CreatePlatformDTO) {
        this.platformService.create(createPlatform);
    }

    @Get()
    async findAll(): Promise<PlatformInterface[]> {
        return this.platformService.findAll();
    }
}
