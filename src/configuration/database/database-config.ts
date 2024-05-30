import { IDatabaseConfiguration } from "../../interfaces/configuration/database/IDatabaseConfiguration";
import { IEnv } from "../../interfaces/configuration/env/IEnv";

export class DatabaseConfiguration implements IDatabaseConfiguration {
    constructor(readonly env: IEnv) {}

    host: string = this.env.DB_HOST || '';
    port:number = this.env.DB_PORT || 0;
    username: string = this.env.DB_USERNAME  || '';
    password: string = this.env.DB_PASSWORD  || '';
    database: string = this.env.DB_DATABASE  || '';
}