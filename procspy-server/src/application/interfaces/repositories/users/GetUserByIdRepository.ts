import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { Session } from "@domain/entities/Session"
import { User } from "@domain/entities/User";


export interface GetUserByIdRepository {
    getUserById(id: GetUserByIdRepository.Request): Promise<GetUserByIdRepository.Response>
}

export namespace GetUserByIdRepository {
    export type Request = string;
    export type Response = User | null
}