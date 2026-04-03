import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { Session } from "@domain/entities/Session"
import { User } from "@domain/entities/User";


export interface GetUsersRepository {
    getUsers(credentials: GetUsersRepository.Request): Promise<GetUsersRepository.Response>
}

export namespace GetUsersRepository {
    export type Request = { page: number, paginationLimit: number };
    export type Response = { data: Array<Omit<User, 'password'>>, page: number, total: number, totalPages: number }
}