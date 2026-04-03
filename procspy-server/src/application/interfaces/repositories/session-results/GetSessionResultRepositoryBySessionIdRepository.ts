import { SessionResult } from "@domain/entities/SessionResult"


export interface GetSessionResultByIdRepository{
    getSessionResultById(id: GetSessionResultByIdRepository.Request): Promise<GetSessionResultByIdRepository.Response>
}

export namespace GetSessionResultByIdRepository {
    export type Request = string
    export type Response = SessionResult | null
}