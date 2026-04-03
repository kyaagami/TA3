import { UnauthorizedError } from "../../../errors/UnauthorizedError";
import { UseCase } from "../UseCase";


export interface SignInInterface extends UseCase<SignInInterface.Request, SignInInterface.Response>{

    execute(credentials: SignInInterface.Request): Promise<SignInInterface.Response>
    
}

export namespace SignInInterface{
    export type Request = {email: string, password: string}
    export type Response = string | UnauthorizedError
}