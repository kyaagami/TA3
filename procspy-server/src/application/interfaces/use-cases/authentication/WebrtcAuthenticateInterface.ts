import { ForbiddenError } from "../../../errors/ForbiddenError"
import { UseCase } from "../UseCase"



export interface WebrtcAuthenticateInterface extends UseCase<WebrtcAuthenticateInterface.Request, WebrtcAuthenticateInterface.Response>{
    execute(httpRequest: WebrtcAuthenticateInterface.Request): Promise<WebrtcAuthenticateInterface.Response>
}

export namespace WebrtcAuthenticateInterface{
    export type Request = string
    export type Response = string | ForbiddenError
}