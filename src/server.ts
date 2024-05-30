import * as Userdata from './api/controllers/user';

import { Request, Server } from '@hapi/hapi';

import { IServerConfiguration } from './interfaces/configuration/api/IServerConfiguration';
import { JwtPlugin } from './configuration/plugins/jwt/jwt-plugins';
import { configPlugins } from './configuration/plugins/plugins-config';

export class FinanceServer {
    constructor (private configs: IServerConfiguration) {}

    private registerRoutes(server: Server, config:IServerConfiguration){

        Userdata.startRoutes(server, config);
        console.log('Routes registered.');
    }

    private async registerServerPlugins(server: Server){

        const jwtPlugin = new JwtPlugin(server, {
            privateKey: this.configs.jwt.privateKey,
            publicKey: this.configs.jwt.publicKey,
            expiration: this.configs.jwt.expiration,
            algorithm: this.configs.jwt.algorithm,
        });

        await configPlugins([jwtPlugin]);
        console.log('Plugins registered.');
    }

    private registerServerExtensions(server: Server){
        server.events.on('request', (request: Request) => {
          const remoteAddress = request.info.remoteAddress;
          const method = request.method.toUpperCase();
          const path = request.path;
          
          console.log(`${remoteAddress} // ${method} ${path}`);
        });
    }

    async init(): Promise<Server> {
        const server = new Server({
            debug: { request: ['error'] },
            port: this.configs.server.port,
            routes: {
                cors: {
                    origin: ['*'],
                },
                validate: {
                    failAction: async (_request, _h , err) => {
                        throw err
                    }
                }
            }
        });

        server.realm.modifiers.route.prefix = '/finance';

        this.registerServerExtensions(server);
        await this.registerServerPlugins(server);
        this.registerRoutes(server, this.configs);

        return server;
    }
}