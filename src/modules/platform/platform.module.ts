/*
https://docs.nestjs.com/modules
*/
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonModule } from "../common";
import { PlatformSchema } from "./schema";
import { PlatformService } from "./service/platform.service";
import { PlatformController } from "./controller";

@Module({
    imports: [
        CommonModule,
        MongooseModule.forFeature(
            [{ name: 'Platform', schema: PlatformSchema }],
            "default"
        ),

    ],
    providers: [PlatformService],
    controllers: [PlatformController],
    exports: [MongooseModule],
})
export class PlatformModule { }
