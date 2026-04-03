import { ForbiddenError } from "../../../errors/ForbiddenError"
import { UseCase } from "../UseCase"



export interface AuthenticateInterface extends UseCase<AuthenticateInterface.Request, AuthenticateInterface.Response>{
    execute(httpRequest: AuthenticateInterface.Request): Promise<AuthenticateInterface.Response>
}

export namespace AuthenticateInterface{
    export type Request = string
    export type Response = string | ForbiddenError
}