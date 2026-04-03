import { User } from "../../../../domain/entities/User"
import { EmailInUseError } from "../../../errors/EmailInUseError"
import { UseCase } from "../UseCase"

export interface SignUpInterface extends UseCase<SignUpInterface.Request, SignUpInterface.Response> {

    execute(credentials: SignUpInterface.Request): Promise<SignUpInterface.Response>
}


export namespace SignUpInterface{
    export type Request = Omit<User, 'active' | 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    export type Response = string | EmailInUseError
}