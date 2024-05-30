import { DatabaseConfiguration } from "../database/database-config";
import { IEnv } from "../../interfaces/configuration/env/IEnv";
import { IServerConfiguration } from "../../interfaces/configuration/api/IServerConfiguration";
import { Secret } from "jsonwebtoken";

export class ServerConfiguration implements IServerConfiguration {
    constructor(
        readonly keys: { publicKey: Secret, privateKey: Secret },
        readonly env: IEnv, 
    ) {}
    server = {
        env: this.env.NODE_ENV,
        port: this.env.PORT,
        baseURL: this.env.API_URL
    };

    database = new DatabaseConfiguration(this.env);
    
    jwt = {
        privateKey: this.keys.privateKey,
        publicKey: this.keys.publicKey,
        algorithm: this.env.JWT_ALGORITHM,
        expiration: this.env.JWT_EXPIRATION
    };
}