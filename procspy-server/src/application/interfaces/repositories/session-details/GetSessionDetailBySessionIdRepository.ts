import { SessionDetail } from "@domain/entities/SessionDetail"
import { Room, RoomProps } from "../../../../domain/entities/Room"


export interface GetSessionDetailBySessionIdRepository{
    getSessionDetailBySessionId(sessionId: GetSessionDetailBySessionIdRepository.Request): Promise<GetSessionDetailBySessionIdRepository.Response>
}

export namespace GetSessionDetailBySessionIdRepository {
    export type Request = string
    export type Response = SessionDetail | null
}