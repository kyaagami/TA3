
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";
import { CreateRoomRepository } from "@application/interfaces/repositories/rooms/CreateRoomRepository";
import { GetRoomByRoomIdRepository } from "@application/interfaces/repositories/rooms/GetRoomByRoomIdRepository";
import { CreateRoomInterface } from "@application/interfaces/use-cases/rooms/CreateRoomInterface";


export class CreateRoom implements CreateRoomInterface {
    constructor(
        private readonly createRoomRepository: CreateRoomRepository,
        private readonly getRoomByRoomIdRepository: GetRoomByRoomIdRepository,
    ) { }

    async execute(body: CreateRoomInterface.Request): Promise<CreateRoomInterface.Response> {
        const { roomId,  title} = body

        const room = await this.getRoomByRoomIdRepository.getRoomByRoomId(roomId)

        if (room) {
            return new RoomAlreadyExistError()
        }
        
        const newRoom = await this.createRoomRepository.createRoom({
            roomId: roomId,
            title: title ?? "No Name"
        })
        
        return newRoom
    }
}