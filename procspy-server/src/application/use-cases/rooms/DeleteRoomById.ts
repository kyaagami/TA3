import { RoomNotExistError } from "@application/errors/RoomNotExistError"
import { GetRoomByIdRepository } from "@application/interfaces/repositories/rooms/GetRoomByIdRepository"
import { UpdateRoomRepository } from "@application/interfaces/repositories/rooms/UpdateRoomRepository"
import { DeleteRoomByIdInterface } from "@application/interfaces/use-cases/rooms/DeleteRoomByIdInterface"


export class DeleteRoomById implements DeleteRoomByIdInterface {
    constructor(
        private readonly getRoomByIdRepository: GetRoomByIdRepository,
        private readonly updateRoomRepository: UpdateRoomRepository,
    ) { }

    async execute(id: DeleteRoomByIdInterface.Request): Promise<DeleteRoomByIdInterface.Response> {
        

        const room = await this.getRoomByIdRepository.getRoomById(id)
        if (!room) {
            return new RoomNotExistError()
        }

        const deletedRoom = await this.updateRoomRepository.updateRoom({
            id, roomId: room.roomId, deletedAt: new Date().toISOString()
        })

        if (!deletedRoom) {
            return new RoomNotExistError()
        }
        
        if(deletedRoom){
            return true
        }

        return false

    }
}