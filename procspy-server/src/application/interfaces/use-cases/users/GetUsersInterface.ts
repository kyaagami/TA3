import { ProctoredUserNotExistError } from "@application/errors/ProctoredUserNotExistError"
import { User } from "@domain/entities/User"
import { UseCase } from "../UseCase"
import { UserNotExistError } from "@application/errors/UserNotExistError"
import { EmailInUseError } from "@application/errors/EmailInUseError"


export interface GetUsersInterface extends UseCase<GetUsersInterface.Request, GetUsersInterface.Response> {

    execute(credentials: GetUsersInterface.Request): Promise<GetUsersInterface.Response>

}

export namespace GetUsersInterface {
    export type Request = { page?: number, paginationLimit?: number }
    export type Response = { data: Array<Omit<User, 'password'>>, page: number, total: number, totalPages: number }
}