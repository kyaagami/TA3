import { DeleteRoomByIdInterface } from "@application/interfaces/use-cases/rooms/DeleteRoomByIdInterface"
import { DeleteProctoredUserById } from "@application/use-cases/proctored-users/DeleteProctoredUserById"
import { DeleteRoomById } from "@application/use-cases/rooms/DeleteRoomById"
import { ProctoredUserRepository } from "@infra/db/mongodb/repositories/ProctoredUserRepository"
import { RoomRepository } from "@infra/db/mongodb/repositories/RoomRepository"



export const makeDeleteRoomById = (): DeleteRoomByIdInterface => {
    const roomRepo = new RoomRepository()
    return new DeleteRoomById(roomRepo, roomRepo)
}