import { Room } from "@domain/entities/Room";
import { UseCase } from "../UseCase";
import { RoomNotExistError } from "@application/errors/RoomNotExistError";


export interface DeleteRoomByIdInterface extends UseCase<DeleteRoomByIdInterface.Request, DeleteRoomByIdInterface.Response> {

    execute(id: DeleteRoomByIdInterface.Request): Promise<DeleteRoomByIdInterface.Response>

}

export namespace DeleteRoomByIdInterface {
    export type Request = string
    export type Response = boolean | RoomNotExistError
}