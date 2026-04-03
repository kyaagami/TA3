import { Log, LogProps } from "@domain/entities/Log"
import { RoomProps } from "../../../../domain/entities/Room"
import { Session } from "@domain/entities/Session"
import { Flag } from "@domain/entities/Flag"


export interface GetLogsByRoomIdRepository{
    getLogsByRoomId(params: GetLogsByRoomIdRepository.Request): Promise<GetLogsByRoomIdRepository.Response>
}

export namespace GetLogsByRoomIdRepository {
    export type Request = {roomId: string, page: number, paginationLimit: number }
    export type Response = { data: Array<Log & {session: Session, flag: Flag}>, page: number, total: number, totalPages: number };
}