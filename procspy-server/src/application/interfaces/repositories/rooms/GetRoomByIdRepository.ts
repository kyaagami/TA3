import { Room, RoomProps } from "../../../../domain/entities/Room"


export interface GetRoomByIdRepository{
    getRoomById(id: GetRoomByIdRepository.Request): Promise<GetRoomByIdRepository.Response>
}

export namespace GetRoomByIdRepository {
    export type Request = string
    export type Response = Room | null
}