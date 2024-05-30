import { IEnv } from "../env/IEnv";

export interface IDatabaseConfiguration {
    env: IEnv;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}