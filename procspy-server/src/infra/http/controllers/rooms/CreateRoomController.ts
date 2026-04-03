import { CreateRoomInterface } from "@application/interfaces/use-cases/rooms/CreateRoomInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";



export class CreateRoomController extends BaseController {

    constructor(
        private readonly createRoomValidation: Validation,
        private readonly createRoom: CreateRoomInterface
    ) {
        super(createRoomValidation)
    }

    async execute(httpRequest: CreateRoomController.Request): Promise<CreateRoomController.Response> {
        const { roomId, title} = httpRequest.body!
        const idOrError = await this.createRoom.execute({ roomId, title })
        if (idOrError instanceof RoomAlreadyExistError) {
            return unauthorized(idOrError)
        } else {
            return ok({ id: idOrError })
        }

    }

}

export namespace CreateRoomController {
    export type Request = HttpRequest<CreateRoomInterface.Request>
    export type Response = HttpResponse<{ id: string } | RoomAlreadyExistError>
}