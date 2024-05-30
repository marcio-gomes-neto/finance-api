import { Algorithm } from "jsonwebtoken"

export interface IEnv {
    NODE_ENV: string

    PORT: number
    API_URL: string

    DB_PORT: number
    DB_HOST: string
    DB_USERNAME: string
    DB_PASSWORD: string
    DB_DATABASE: string

    JWT_EXPIRATION: string
    JWT_ALGORITHM: Algorithm
}