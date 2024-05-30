import * as dotenv from 'dotenv';

import { cleanEnv, num, str } from 'envalid';

import { IEnv } from '../../interfaces/configuration/env/IEnv';
import { IEnvConfiguration } from '../../interfaces/configuration/env/IEnvConfiguration';

export class EnviromentConfiguration implements IEnvConfiguration {
    readonly env: IEnv
    constructor(){
        dotenv.config();
        this.env = cleanEnv(process.env, {
            NODE_ENV: str(),
            PORT: num({default: 3000}),
            API_URL: str(),
            DB_PORT: num({default: 5432}),
            DB_HOST: str(),
            DB_USERNAME: str(),
            DB_PASSWORD: str(),
            DB_DATABASE: str(),
            JWT_EXPIRATION: str(),
            JWT_ALGORITHM: str({choices: ['RS256', 'RS384', 'RS512', 'PS256', 'ES256']}),
        });
    }
}