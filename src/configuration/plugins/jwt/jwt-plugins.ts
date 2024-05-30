import * as hapiJwt from 'hapi-auth-jwt2';

import { IJwt } from "../../../interfaces/configuration/plugins/Jwt/IJwt";
import { IJwtDecoded } from "../../../interfaces/configuration/plugins/Jwt/IJwtDecoded";
import { IJwtRequest } from "../../../interfaces/configuration/plugins/Jwt/IJwtRequest";
import { IPlugin } from "../../../interfaces/configuration/plugins/IPlugin";
import { Server } from "@hapi/hapi";
import { unauthorized } from "boom";
import { validate } from "uuid";

export class JwtPlugin implements IPlugin {
    constructor(private server: Server, private jwtModel: IJwt) {}

    static checkIdContent(id: string | undefined): string{
        if(!id) throw unauthorized();
        return id;
    }

    static validateId(id: string | undefined): string | undefined {
        if(id){
            const validId = validate(id)
            if (!validId) throw unauthorized();
            return id;
        }
        return
    }

    static checkIdContentPattern(id: string | undefined): string {
        const idValidContent = JwtPlugin.checkIdContent(id);
        JwtPlugin.validateId(idValidContent);
        return idValidContent;
    }
    
    static validateDecodedJwt(jwtDecoded: IJwtDecoded, request: IJwtRequest): {isValid: boolean} {
    try {
        const rawUserId = jwtDecoded.id
        const userId = JwtPlugin.checkIdContentPattern(rawUserId);
        request.authId = { userId };
        return {isValid: true};
    } catch (error) {
        return {isValid: false};
    }
    }
    
    private jwtStrategy(): object {
    return {
        key: [this.jwtModel.privateKey, this.jwtModel.publicKey],
        validate: JwtPlugin.validateDecodedJwt,
        verifyOptions: {
        algorithms: [this.jwtModel.algorithm],
        ignoreExpiration: false,
        },
        headless: {
        alg: this.jwtModel.algorithm,
        typ: 'JWT',
        },
    };
    }

    public async register() {
        await this.server.register(hapiJwt);

        const strategy = this.jwtStrategy();
        this.server.auth.strategy('jwt', 'jwt', strategy);
        this.server.auth.default('jwt');
    }
}