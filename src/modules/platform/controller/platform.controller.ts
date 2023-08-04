import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Patch,
    Post,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { PlatformService } from "../service/platform.service";
import { PlatformData, PlatformIdInput, PlatformInput, PlatformUpdateInput } from "../model";
import { PlatformPipe } from "../flow/platform.pipe";

@Controller("Platform")
@ApiTags("Platform")
export class PlatformController {
    public constructor(
        private readonly platformService: PlatformService
    ) { }

    @Get("getAllPlatforms")
    @ApiResponse({
        status: HttpStatus.OK,
        isArray: true,
        type: PlatformData,
    })
    public async find() {
        return this.platformService.find();
    }

    @Post("createPlatform")
    @ApiResponse({ status: HttpStatus.CREATED, type: PlatformData })
    public async create(@Body(PlatformPipe) input: PlatformInput) {
        const platform = await this.platformService.create(input);

        return platform;
    }


    @Delete("deletePlatform")
    @ApiResponse({ status: HttpStatus.CREATED, type: PlatformData })
    public async remove(@Body(PlatformPipe) input: PlatformIdInput) {
        await this.platformService.remove(input);
    }


    @Patch("updatePlatform")
    @ApiResponse({ status: HttpStatus.CREATED, type: PlatformData })
    public async update(@Body(PlatformPipe) input: PlatformUpdateInput) {
        await this.platformService.update(input);
    }


}
