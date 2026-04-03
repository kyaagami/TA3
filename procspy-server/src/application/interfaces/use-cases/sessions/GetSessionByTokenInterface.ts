import { Session } from "@domain/entities/Session";
import { UseCase } from "../UseCase";
import { SessionAlreadyExistError } from "@application/errors/SessionAlreadyExistError";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";


export interface GetSessionByTokenInterface extends UseCase<GetSessionByTokenInterface.Request, GetSessionByTokenInterface.Response>{

    execute(credentials: GetSessionByTokenInterface.Request): Promise<GetSessionByTokenInterface.Response>
    
}

export namespace GetSessionByTokenInterface{
    export type Request = string;
      export type Response = Session | SessionNotExistError;
}