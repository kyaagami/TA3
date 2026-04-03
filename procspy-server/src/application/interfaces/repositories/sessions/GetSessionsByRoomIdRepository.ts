import { EnrichedSession } from "@application/interfaces/use-cases/sessions/GetSessionsByRoomIdInterface";
import { Session } from "@domain/entities/Session"


export interface GetSessionsByRoomIdRepository {
    getSessionsByRoomId(params: GetSessionsByRoomIdRepository.Request): Promise<GetSessionsByRoomIdRepository.Response>
}

export namespace GetSessionsByRoomIdRepository {
    export type Request = { roomId: string, page: number, paginationLimit: number }
    export type Response = { data: Array<EnrichedSession>, page: number, total: number, totalPages: number };
}