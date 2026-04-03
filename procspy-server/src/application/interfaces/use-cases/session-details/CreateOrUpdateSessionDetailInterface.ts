import { UseCase } from "../UseCase";
import { SessionDetail } from "@domain/entities/SessionDetail";
import { SessionLockedError } from "@application/errors/SesionLockedError";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";


export interface CreateOrUpdateSessionDetailInterface extends UseCase<CreateOrUpdateSessionDetailInterface.Request, CreateOrUpdateSessionDetailInterface.Response> {

    execute(credentials: CreateOrUpdateSessionDetailInterface.Request): Promise<CreateOrUpdateSessionDetailInterface.Response>

}

export namespace CreateOrUpdateSessionDetailInterface {
    export type Request = {
        token: string
        
    } & Omit<SessionDetail, 'id' | 'startTime' | 'updatedAt' | 'createdAt'>
    export type Response = {prevIp: string } &SessionDetail | SessionLockedError | SessionNotExistError
}