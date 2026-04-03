import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { Session } from "@domain/entities/Session"


export interface GetSessionByTokenRepository {
    getSessionByToken(token: GetSessionByTokenRepository.Request): Promise<GetSessionByTokenRepository.Response>
}

export namespace GetSessionByTokenRepository {
    export type Request = string
    export type Response = Session | null
}