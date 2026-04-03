import { DeleteRoomByIdInterface } from "@application/interfaces/use-cases/rooms/DeleteRoomByIdInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomNotExistError } from "@application/errors/RoomNotExistError";
import { Room } from "@domain/entities/Room";



export class DeleteRoomByIdController extends BaseController {

    constructor(
        private readonly updateRoomValidation: Validation,
        private readonly updateRoom: DeleteRoomByIdInterface
    ) {
        super(updateRoomValidation)
    }

    async execute(httpRequest: DeleteRoomByIdController.Request): Promise<DeleteRoomByIdController.Response> {
        const { id } = httpRequest.params!
        const idOrError = await this.updateRoom.execute(id)
        if (idOrError instanceof RoomNotExistError) {
            return unauthorized(idOrError)
        } else {
            return ok({success: idOrError})
        }

    }

}

export namespace DeleteRoomByIdController {
    export type Request = HttpRequest<DeleteRoomByIdInterface.Request>
    export type Response = HttpResponse<{success: boolean} | RoomNotExistError>
}
