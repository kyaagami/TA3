import { Session } from "@domain/entities/Session";
import { UseCase } from "../UseCase";
import { SessionAlreadyExistError } from "@application/errors/SessionAlreadyExistError";


export interface CreateSessionInterface extends UseCase<CreateSessionInterface.Request, CreateSessionInterface.Response>{

    execute(credentials: CreateSessionInterface.Request): Promise<CreateSessionInterface.Response>
    
}

export namespace CreateSessionInterface{
    export type Request = Omit<Session, 'id' | 'startTime'| 'endTime' | 'createdAt' | 'token'>
    export type Response = string | SessionAlreadyExistError
}