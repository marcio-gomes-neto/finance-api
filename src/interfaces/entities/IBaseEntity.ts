import { Timestamp } from "typeorm";

export interface IBaseEntity {
    id: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
}