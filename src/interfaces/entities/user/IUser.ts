import { IBaseEntity } from "../IBaseEntity";

export interface IUser extends IBaseEntity {
    cpf: string;
    email: string;
    emailVerification: string;
    password: string;
    name: string;
    phone: string;
    status: string;
}