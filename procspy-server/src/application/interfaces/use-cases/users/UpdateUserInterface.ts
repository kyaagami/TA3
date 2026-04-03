import { ProctoredUserNotExistError } from "@application/errors/ProctoredUserNotExistError"
import { User } from "@domain/entities/User"
import { UseCase } from "../UseCase"
import { UserNotExistError } from "@application/errors/UserNotExistError"
import { EmailInUseError } from "@application/errors/EmailInUseError"


export interface UpdateUserInterface extends UseCase<UpdateUserInterface.Request, UpdateUserInterface.Response> {

    execute(credentials: UpdateUserInterface.Request): Promise<UpdateUserInterface.Response>

}

export namespace UpdateUserInterface {
    export type Request = Omit<User, 'createdAt'>
    export type Response = Omit <User, 'password'> | UserNotExistError | EmailInUseError
}