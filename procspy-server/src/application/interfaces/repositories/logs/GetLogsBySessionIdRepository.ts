import { Log, LogProps } from "@domain/entities/Log"
import { RoomProps } from "../../../../domain/entities/Room"


export interface GetLogsBySessionIdRepository{
    getLogsBySessionId(params: GetLogsBySessionIdRepository.Request): Promise<GetLogsBySessionIdRepository.Response>
}

export namespace GetLogsBySessionIdRepository {
    export type Request = {sessionId: string, page: number, paginationLimit: number}
    export type Response = { data: Log[], page: number, total:number, totalPages: number, }
}