import { Algorithm, Secret } from "jsonwebtoken";

export interface IJwt {
    publicKey: Secret;
    privateKey: Secret;
    expiration: string;
    algorithm: Algorithm;
}