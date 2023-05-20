import { Module } from "@nestjs/common";
import { LogInterceptor } from "./flow/log.interceptor";
import { LoggerService } from "./provider/logger.service";

@Module({
    imports: [],
    providers: [LoggerService, LogInterceptor],
    exports: [LoggerService, LogInterceptor],
})
export class CommonModule { }
