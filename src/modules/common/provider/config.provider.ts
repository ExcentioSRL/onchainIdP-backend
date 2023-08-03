import * as Joi from 'joi';
import * as _ from 'lodash';

import { Service } from '../../tokens';
import { Config } from '../model';

export const configProvider = {

    provide: Service.CONFIG,
    useFactory: (): Config => {

        const env = process.env;
        const validationSchema = Joi.object().unknown().keys({
            API_PORT: Joi.string().required(),
            API_PREFIX: Joi.string().required(),
            SWAGGER_ENABLE: Joi.string().required(),
            MONGO_URI: Joi.string().required(),
            JWT_SECRET: Joi.string().required(),
            JWT_ISSUER: Joi.string().required()
        });

        const result = validationSchema.validate(env);

        if (result.error) {
            throw new Error('Configuration not valid: ' + result.error.message);
        }

        return {
            API_PORT: _.toNumber(env.API_PORT),
            API_PREFIX: `${env.API_PREFIX}`,
            SWAGGER_ENABLE: _.toNumber(env.SWAGGER_ENABLE),
            MONGO_URI: `${env.MONGO_URI}`,
            JWT_SECRET: `${env.JWT_SECRET}`
        };
    }

};
