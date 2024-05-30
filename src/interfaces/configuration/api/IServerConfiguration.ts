import { IDatabaseConfiguration } from "../database/IDatabaseConfiguration";
import { IEnv } from "../env/IEnv";
import { IJwt } from "../plugins/Jwt/IJwt";
import { Secret } from "jsonwebtoken";

export interface IServerConfiguration{
    env: IEnv;
    keys: {
        privateKey: Secret,
        publicKey: Secret,
    }
    server: {
        env: string;
        port: number;
        baseURL: string;
    }
    database: IDatabaseConfiguration;

    jwt: IJwt;
}