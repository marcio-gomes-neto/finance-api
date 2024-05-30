import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";

import { IUser } from "../../../interfaces/entities/user/IUser";

@Entity()
export class User extends BaseEntity implements IUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 11, unique: true, name: 'cpf' })
    cpf: string;

    @Column({ type: 'varchar', length: 255, unique: true, name: 'email' })
    email: string;

    @Column({ type: 'varchar', length: 255, name: 'email_verification' })
    emailVerification: string;
    
    @Column({ type: 'varchar', length: 512, name: 'password' })
    password: string;

    @Column({ type: 'varchar', length: 100, name: 'name' })
    name: string;

    @Column({ type: 'varchar', length: 50, name: 'phone' })
    phone: string;

    @Column({ type: 'varchar', default: 'waiting-verification', name: 'status' })
    status: string;

    @Column({ type: 'boolean', default: false, name: 'admin' })
    admin: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Timestamp;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Timestamp;
}