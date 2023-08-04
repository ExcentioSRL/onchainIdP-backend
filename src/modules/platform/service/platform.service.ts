import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PlatformIdInput, PlatformInput, PlatformUpdateInput } from "../model/platform.input";
import { PlatformDocument } from "../schema";

@Injectable()
export class PlatformService {
    public constructor(
        @InjectModel('Platform')
        private platformModel: Model<PlatformDocument>
    ) { }

    public async find() {
        return (
            await this.platformModel.find()
                .exec()
        ).map((p) => p.toObject());
    }

    public async create(input: PlatformInput) {
        const createdPlatform = new this.platformModel(input);
        const platform = await createdPlatform.save();
        return platform.toObject();
    }

    public async remove(input: PlatformIdInput) {
        return await this.platformModel.findByIdAndRemove(input._id);
    }

    public async update(input: PlatformUpdateInput) {
        return await this.platformModel.findByIdAndUpdate(
            input._id,
            input
        );
    }
}
