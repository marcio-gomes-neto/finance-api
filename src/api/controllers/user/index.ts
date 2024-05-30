import * as Hapi from '@hapi/hapi';
import * as UserValidator from './user-validator';

import { IServerConfiguration } from '../../../interfaces/configuration/api/IServerConfiguration';
import { UserController } from './user-controller';

export function startRoutes (server: Hapi.Server, configs: IServerConfiguration) {
    const userController = new UserController(configs);
    server.bind(userController);

    server.route({
        method: "GET",
        path: `/hello-world`,
        options:{
            handler: userController.returnHelloWorld,
            auth: false,
            tags: ['api', 'user'],
            description: 'Return Hello World',
        }
    });

    server.route({
        method: "POST",
        path: `/create`,
        options:{
            handler: userController.createUser,
            auth: "jwt",
            tags: ['api', 'user'],
            description: 'Route to create a regular user',
            validate: {
                headers: UserValidator.optionalJwtValidator,
                payload: UserValidator.createUserValidator
            },
        }
    });

    server.route({
        method: "POST",
        path: `/login`,
        options:{
            handler: userController.loginUser,
            auth: false,
            tags: ['api', 'user'],
            description: 'Route to login users',
            validate: {
                payload: UserValidator.loginUserValidator
            },
        }
    });
}