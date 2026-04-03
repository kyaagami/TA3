import { GetProctoredUsersInterface } from "@application/interfaces/use-cases/proctored-users/GetProctoredUsersInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";



export class GetProctoredUsersController extends BaseController {

    constructor(
        // private readonly getProctoredUsersValidation: Validation,
        private readonly getProctoredUsers: GetProctoredUsersInterface
    ) {
        super()
    }

    async execute(httpRequest: GetProctoredUsersController.Request): Promise<GetProctoredUsersController.Response> {
        const { page, paginationLimit } = httpRequest.query!
        const response = await this.getProctoredUsers.execute({ page, paginationLimit })
        return ok(response)

    }

}

export namespace GetProctoredUsersController {
    export type Request = HttpRequest<undefined, { page?: number, paginationLimit?: number }>;
    export type Response = HttpResponse<GetProctoredUsersInterface.Response>
}