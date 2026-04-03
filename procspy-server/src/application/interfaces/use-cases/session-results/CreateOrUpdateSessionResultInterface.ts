import { UseCase } from "../UseCase";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { LogType } from "@domain/entities/Log";
import { SessionResult, SessionResultProps } from "@domain/entities/SessionResult";


export interface CreateOrUpdateSessionResultInterface extends UseCase<CreateOrUpdateSessionResultInterface.Request, CreateOrUpdateSessionResultInterface.Response>{

    execute(credentials: CreateOrUpdateSessionResultInterface.Request): Promise<CreateOrUpdateSessionResultInterface.Response>
    
}

export namespace CreateOrUpdateSessionResultInterface{
    export type Request = {sessionId: string, flagKey: string, logType: LogType, prevLogType?: LogType}
    export type Response = SessionResult | SessionNotExistError
}