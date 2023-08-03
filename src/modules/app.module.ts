import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonModule } from "./common";

@Module({
    imports: [
        CommonModule,
        ScheduleModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_URI!, {
            connectionName: "default",
        }),

    ],
})
export class ApplicationModule { }
