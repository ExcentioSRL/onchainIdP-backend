import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PlatformDocument = HydratedDocument<Platform>;

@Schema()
export class Platform {
    @Prop()
    name: string;
    @Prop()
    redirectUrl: string;
    @Prop()
    pathImage: string;
    @Prop()
    description: string;
}
export const PlatformSchema = SchemaFactory.createForClass(Platform);
