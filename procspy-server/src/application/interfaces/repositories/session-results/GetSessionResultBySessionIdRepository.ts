import { SessionResult } from "@domain/entities/SessionResult"


export interface GetSessionResultBySessionIdRepository{
    getSessionResultBySessionId(sessionId: GetSessionResultBySessionIdRepository.Request): Promise<GetSessionResultBySessionIdRepository.Response>
}

export namespace GetSessionResultBySessionIdRepository {
    export type Request = string
    export type Response = SessionResult | null
}