import { Session } from "@domain/entities/Session"


export interface GetSessionByIdRepository{
    getSessionById(sessionId: GetSessionByIdRepository.Request): Promise<GetSessionByIdRepository.Response>
}

export namespace GetSessionByIdRepository {
    export type Request = string
    export type Response = Session | null
}