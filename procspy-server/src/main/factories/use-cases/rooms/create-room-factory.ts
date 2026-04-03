import { CreateRoomInterface } from "@application/interfaces/use-cases/rooms/CreateRoomInterface"
import { CreateRoom } from "@application/use-cases/rooms/CreateRoom"
import { RoomRepository } from "@infra/db/mongodb/repositories/RoomRepository"


export const makeCreateRoom = (): CreateRoomInterface => {
    const roomRepository = new RoomRepository()
    const GetRoomByIdRepository = new RoomRepository()
    return new CreateRoom(roomRepository, GetRoomByIdRepository)
}