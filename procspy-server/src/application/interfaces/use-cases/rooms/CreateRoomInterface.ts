import { Room } from "@domain/entities/Room";
import { UseCase } from "../UseCase";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";


export interface CreateRoomInterface extends UseCase<CreateRoomInterface.Request, CreateRoomInterface.Response>{

    execute(credentials: CreateRoomInterface.Request): Promise<CreateRoomInterface.Response>
    
}

export namespace CreateRoomInterface{
    export type Request = Omit<Room, 'id' | 'createdAt'>
    export type Response = string | RoomAlreadyExistError
}