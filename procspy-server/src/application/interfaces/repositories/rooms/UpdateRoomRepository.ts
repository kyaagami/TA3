import { Room, RoomProps } from "@domain/entities/Room"


export interface UpdateRoomRepository{
    updateRoom(data: UpdateRoomRepository.Request): Promise<UpdateRoomRepository.Response>
}

export namespace UpdateRoomRepository {
    export type Request = Omit<RoomProps, 'createdAt' >
    export type Response = Room | null
}