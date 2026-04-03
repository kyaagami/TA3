import { UseCase } from "../UseCase";
import { Log, LogType } from "@domain/entities/Log";
import { LogNotExistError } from "@application/errors/LogNotExistError";


export interface UpdateLogByIdInterface extends UseCase<UpdateLogByIdInterface.Request, UpdateLogByIdInterface.Response>{

    execute(credentials: UpdateLogByIdInterface.Request): Promise<UpdateLogByIdInterface.Response>
    
}

export namespace UpdateLogByIdInterface{
    export type Request =  Omit<Log, 'timestamp' | 'sessionId' | 'flagKey' | 'attachment'>
    export type Response = Log & {prevLogType: LogType}  | LogNotExistError
}