import { Room } from "@domain/entities/Room";
import { UseCase } from "../UseCase";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";
import { Log } from "@domain/entities/Log";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";


export interface CreateLogInterface extends UseCase<CreateLogInterface.Request, CreateLogInterface.Response>{

    execute(credentials: CreateLogInterface.Request): Promise<CreateLogInterface.Response>
    
}

export namespace CreateLogInterface{
    export type Request = Omit<Log, 'id' | 'timestamp'>
    export type Response = Log | SessionNotExistError
}