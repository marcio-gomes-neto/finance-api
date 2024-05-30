import * as fs from 'fs'
import * as path from "path";

import { ConnectionFactory } from "./database/factory/connectionFactory";
import { EnviromentConfiguration } from "./configuration/env/enviroment-config";
import { FinanceServer } from "./server";
import { ServerConfiguration } from "./configuration/api/server-config";

(async () => {
    try {
        const privateKey = fs.readFileSync(path.join(__dirname, '../private.key'), 'utf8');
        const publicKey = fs.readFileSync(path.join(__dirname, '../public.key'), 'utf8');
        if(!privateKey || !publicKey) throw `SSH keys missing.`;

        const configEnviroment = new EnviromentConfiguration()
        const configServer = new ServerConfiguration({ privateKey, publicKey},configEnviroment.env);
        await ConnectionFactory.init(configServer.database);
        console.log('Connected to database.');

        const server = new FinanceServer(configServer);
        const hapiServer = await server.init();
        
        hapiServer.start();
        console.log('Server Running at: ' + hapiServer.info.uri);
        console.log('Ready to receive requests.');

    } catch (error) {
        console.log('Error starting server: ', error);
    }
})();