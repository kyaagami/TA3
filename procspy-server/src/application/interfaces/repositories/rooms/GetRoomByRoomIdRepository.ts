import { Room, RoomProps } from "../../../../domain/entities/Room"


export interface GetRoomByRoomIdRepository{
    getRoomByRoomId(RoomData: GetRoomByRoomIdRepository.Request): Promise<GetRoomByRoomIdRepository.Response>
}

export namespace GetRoomByRoomIdRepository {
    export type Request = string
    export type Response = Room | null
}