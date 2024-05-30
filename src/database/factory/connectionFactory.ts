import * as entities from '../entities';

import { DataSource } from 'typeorm';
import { IDatabaseConfiguration } from '../../interfaces/configuration/database/IDatabaseConfiguration';

export class ConnectionFactory {
    public static async init(conn:IDatabaseConfiguration): Promise<DataSource> {
        const connection = new DataSource({
            type: 'postgres',
            host: conn.host,
            port: conn.port,
            username: conn.username,
            password: conn.password,
            database: conn.database,
            entities: Object.keys(entities),
            logging: true
        });
        await connection.initialize();
        return connection;
    }

    private getEntities(){
        
    }
}