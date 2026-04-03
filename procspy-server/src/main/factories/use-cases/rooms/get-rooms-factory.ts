import { GetRoomsInterface } from "@application/interfaces/use-cases/rooms/GetRoomsInterface"
import { CreateRoom } from "@application/use-cases/rooms/CreateRoom"
import { GetRooms } from "@application/use-cases/rooms/GetRooms"
import { RoomRepository } from "@infra/db/mongodb/repositories/RoomRepository"


export const makeGetRooms = (): GetRoomsInterface => {
    const roomRepository = new RoomRepository()
    return new GetRooms(roomRepository)
}