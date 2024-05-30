import { Request } from "@hapi/hapi";

export interface IJwtRequest extends Request {
    authId: {
        userId: string;
    }
}