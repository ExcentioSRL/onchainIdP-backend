import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Platform } from '../dto/platform.data';
import { CreatePlatformDTO } from '../dto/create-platform.dto';

export interface PlatformInterface {
    name: string;
    redirectUrl: string;
    pathImage: string;
    description: string;
}

@Injectable()
export class PlatformService {
    constructor(
        @Inject('PLATFORM_MODEL')
        private platformModel: Model<Platform>,
    ) { }

    async create(createPlatformDto: CreatePlatformDTO): Promise<Platform> {
        const createdPlatform = new this.platformModel(createPlatformDto);
        return createdPlatform.save();
    }

    async findAll(): Promise<Platform[]> {
        return this.platformModel.find().exec();
    }
}
