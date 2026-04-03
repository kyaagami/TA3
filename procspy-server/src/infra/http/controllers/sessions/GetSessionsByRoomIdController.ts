import { GetSessionsByRoomIdInterface } from "@application/interfaces/use-cases/sessions/GetSessionsByRoomIdInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";



export class GetSessionsByRoomIdController extends BaseController {

    constructor(
        private readonly getSessionsByRoomIdValidation: Validation,
        private readonly getSessionsByRoomId: GetSessionsByRoomIdInterface
    ) {
        super(getSessionsByRoomIdValidation)
    }

    async execute(httpRequest: GetSessionsByRoomIdController.Request): Promise<GetSessionsByRoomIdController.Response> {
        const { page, paginationLimit } = httpRequest.query!
        const { roomId} = httpRequest.params!
        const response = await this.getSessionsByRoomId.execute({ page, roomId, paginationLimit })
        return ok(response)

    }

}

export namespace GetSessionsByRoomIdController {
    export type Request = HttpRequest<GetSessionsByRoomIdInterface.Request>
    export type Response = HttpResponse<GetSessionsByRoomIdInterface.Response>
}