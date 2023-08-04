import * as Joi from "joi";
import { JoiValidationPipe } from "../../common";
import { PlatformInput } from '../model';

export class PlatformPipe extends JoiValidationPipe {
    public buildSchema(): Joi.Schema {
        return Joi.object<PlatformInput>({
            name: Joi.string(),
            redirectUrl: Joi.string(),
        });
    }
}