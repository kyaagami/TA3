import { Room, RoomProps } from "../../../../domain/entities/Room"


export interface GetRoomsRepository{
    getRooms(params: GetRoomsRepository.Request): Promise<GetRoomsRepository.Response>
}

export namespace GetRoomsRepository {
    export type Request  = { page: number, paginationLimit: number }
    export type Response =  { data: Room[], page: number, total: number, totalPages: number };
}