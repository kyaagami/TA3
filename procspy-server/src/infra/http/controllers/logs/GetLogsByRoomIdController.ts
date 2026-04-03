import { GetLogsByRoomIdInterface } from "@application/interfaces/use-cases/logs/GetLogsByRoomIdInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";



export class GetLogsByRoomIdController extends BaseController {

    constructor(
        private readonly getLogsByRoomIdValidation: Validation,
        private readonly getLogsByRoomId: GetLogsByRoomIdInterface
    ) {
        super(getLogsByRoomIdValidation)
    }

    async execute(httpRequest: GetLogsByRoomIdController.Request): Promise<GetLogsByRoomIdController.Response> {
        const { page, paginationLimit } = httpRequest.query!
        const { roomId} = httpRequest.params!
        const response = await this.getLogsByRoomId.execute({ page, roomId, paginationLimit })
        return ok(response)

    }

}

export namespace GetLogsByRoomIdController {
    export type Request = HttpRequest<GetLogsByRoomIdInterface.Request>
    export type Response = HttpResponse<GetLogsByRoomIdInterface.Response>
}