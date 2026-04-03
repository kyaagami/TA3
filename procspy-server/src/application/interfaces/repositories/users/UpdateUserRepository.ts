import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { Session } from "@domain/entities/Session"
import { User } from "@domain/entities/User";


export interface UpdateUserRepository {
    updateUser(userData: UpdateUserRepository.Request): Promise<UpdateUserRepository.Response>
}

export namespace UpdateUserRepository {
    export type Request = {id: string} & Partial<Omit<User, 'id' | 'createdAt'>>;
    export type Response = User | null
}