import { RoomProps } from "../../../../domain/entities/Room"


export interface CreateRoomRepository{
    createRoom(RoomData: CreateRoomRepository.Request): Promise<CreateRoomRepository.Response>
}

export namespace CreateRoomRepository {
    export type Request = Omit<RoomProps, 'id' | 'createdAt' >
    export type Response = string
}