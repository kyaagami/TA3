import { GetRoomsInterface } from "@application/interfaces/use-cases/rooms/GetRoomsInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";



export class GetRoomsController extends BaseController {

    constructor(
        private readonly getRoomsValidation: Validation,
        private readonly getRooms: GetRoomsInterface
    ) {
        super(getRoomsValidation)
    }

    async execute(httpRequest: GetRoomsController.Request): Promise<GetRoomsController.Response> {
        const { page, paginationLimit } = httpRequest.query!
        const response = await this.getRooms.execute({ page, paginationLimit })
        return ok(response)

    }

}

export namespace GetRoomsController {
    export type Request = HttpRequest<GetRoomsInterface.Request>
    export type Response = HttpResponse<GetRoomsInterface.Response>
}