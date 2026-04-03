import { User } from "@domain/entities/User";
import { UnauthorizedError } from "../../../errors/UnauthorizedError";
import { UseCase } from "../UseCase";
import { UserNotExistError } from "@application/errors/UserNotExistError";


export interface ActivateUserInterface extends UseCase<ActivateUserInterface.Request, ActivateUserInterface.Response>{
    execute(id: ActivateUserInterface.Request): Promise<ActivateUserInterface.Response>
}

export namespace ActivateUserInterface{
    export type Request = string
    export type Response = User | UserNotExistError
}