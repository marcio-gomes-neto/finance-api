import * as Hapi from '@hapi/hapi';
import * as bcrypt from 'bcrypt';
import * as documentValidator from 'cpf-cnpj-validator';

import Boom from 'boom';
import { IServerConfiguration } from '../../../interfaces/configuration/api/IServerConfiguration';
import { IUser } from '../../../interfaces/entities';
import { User } from '../../../database/entities';
import { UserService } from '../../services/UserService';
import { sign } from 'jsonwebtoken';
import { userRequests } from '../../../interfaces/api';
import { v4 as uuidv4 } from 'uuid';

export class UserController {
    private userService = new UserService();

    constructor(private config:IServerConfiguration){}

    private generateJwtToken(user:IUser){
        const signInRequest = {id: user.id};
        const token = sign(signInRequest, this.config.jwt.privateKey, {
            expiresIn: this.config.jwt.expiration,
            algorithm: this.config.jwt.algorithm
        });
        return token;
    }

    private async validateUserPassword(payloadPassword: string, userPassword: string){
        return await bcrypt.compare(payloadPassword, userPassword);
    }

    async loginUser(request: userRequests.LoginUserRequest, h: Hapi.ResponseToolkit){
        const { cpf, email, password } = request.payload;

        if(cpf && !documentValidator.cpf.isValid(cpf)) return Boom.badRequest('Invalid CPF.');
        try {
            const findUser = cpf ? await this.userService.findUserByCpf(cpf) : undefined
            if(!findUser){
                return Boom.notFound(`User not found to given ${cpf ? 'cpf' : 'email'}.`);
            }

            if(findUser.status === 'blocked') return Boom.unauthorized('User blocked.');

            const checkPassword = await this.validateUserPassword(password, findUser.password);
            if(!checkPassword){
                return Boom.unauthorized(`Invalid password.`);
            }

            const token = await this.generateJwtToken(findUser);
            const response = {
                success: true,
                login: cpf? cpf : email,
                userStatus: findUser.status,
                token: token,
            };

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');  
        }
    }

    async createUser(request: userRequests.CreateUserRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        const { cpf, password, confirmPassword, name, email, admin, phone } = request.payload;
        const salt = await bcrypt.genSalt(10);

        const newUser = new User()
        newUser.cpf = cpf;
        newUser.name = name;
        newUser.email = email;
        newUser.emailVerification = uuidv4();
        newUser.password = await bcrypt.hash(password, salt);
        newUser.phone = phone;
        newUser.status = 'waiting-verification';

        if(admin){
            if(!userId) return Boom.unauthorized('Requires authorization to create admin user');
            try {
                const findAdmin = await this.userService.findUserById(userId);
                if (!findAdmin) return Boom.notFound('User not found.');
                if (!findAdmin.admin) return Boom.unauthorized('Admin level necessary.');
            } catch (error) {
                console.log(error);
                return Boom.badRequest('Unexpected Error');  
            }
        }

        if(password !== confirmPassword) return Boom.badRequest('Password do not match.');
        if(!documentValidator.cpf.isValid(cpf)) return Boom.badRequest('Invalid CPF.');
        
        try {
            const checkForCpf = await this.userService.findUserByCpf(cpf);
            if(checkForCpf) return Boom.badRequest('This user already exists.');

            const checkForEmail = await this.userService.findUserByEmail(email);
            if(checkForEmail) return Boom.badRequest('This email already taken.');

            const userCreated = await this.userService.createNewUser(newUser);
            
            const response = {
                success: true,
                payload: {
                    id: userCreated.id,
                    cpf: userCreated.cpf,
                    email: userCreated.email,
                    admin: userCreated.admin
                }
            }; 

            return h.response(response).code(201);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');   
        }
    }

    async returnHelloWorld(_request: any, h: Hapi.ResponseToolkit){
        return h.response('Hello World').code(200);
    }
}