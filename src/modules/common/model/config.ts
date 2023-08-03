export interface Config {

    readonly API_PORT: number;

    readonly API_PREFIX: string;

    readonly SWAGGER_ENABLE: number;
    readonly MONGO_URI:string    
    readonly JWT_SECRET: string;

}
