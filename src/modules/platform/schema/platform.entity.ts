import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PlatformDocument = Document<any, any, Platform> & Platform;

@Schema({
    id: true,
    toJSON: {
        virtuals: true,
        getters: false,
        //disable the generation of __V field
        versionKey: false,
    },
    toObject: {
        virtuals: true,
        versionKey: false,
    },
})
export class Platform {

    @Prop({ required: true })
    public name: string;

    @Prop({ required: true })
    public redirectUrl: string;

}

export const PlatformSchema = SchemaFactory.createForClass(Platform);
