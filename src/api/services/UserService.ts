import { IUser } from "../../interfaces/entities";
import { User } from "../../database/entities";

export class UserService{
    private userRepository = User;

    async createNewUser(user: User) {
        const userCreated = await this.userRepository.save(user);
        return userCreated;
    }

    async findUserByCpf(cpf: string){
        const findUser = await this.userRepository.findOneBy({ cpf: cpf});
        return findUser;
    }

    async findUserById(id: string){
        const findUser = await this.userRepository.findOneBy({id: id});
        return findUser;
    }

    async findUserByEmail(email: string){
        const findUser = await this.userRepository.findOneBy({email: email});
        return findUser;
    }

    async findUserByEmailVerification(code: string){
        const findUser = await this.userRepository.findOneBy({emailVerification: code});
        return findUser;
    }

    async activateUser(id: string){
        const updateUser = await this.userRepository.update(id, {status: 'active'});
        return updateUser;
    }

    async deactivateUser(id: string){
        const updateUser = await this.userRepository.update(id, {status: 'inactive'});
        return updateUser;
    }

    async saveUserUpdates(user: IUser){
        await this.userRepository.update(user.id, user);
    }
}