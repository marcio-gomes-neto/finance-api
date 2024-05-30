export interface CreateNewTransaction extends Request {
    authId?:{
        userId: string;
    }

    payload: {
        cpf: string;
        name: string;
        email: string;
        admin: boolean;
        password: string;
        confirmPassword: string;
        phone: string;
    }
} 