import { GetSessionsByProctoredUserIdInterface } from "@application/interfaces/use-cases/sessions/GetSessionsByProctoredUserId";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";



export class GetSessionsByProctoredUserIdController extends BaseController {

    constructor(
        private readonly getSessionsByProctoredUserIdValidation: Validation,
        private readonly getSessionsByProctoredUserId: GetSessionsByProctoredUserIdInterface
    ) {
        super(getSessionsByProctoredUserIdValidation)
    }

    async execute(httpRequest: GetSessionsByProctoredUserIdController.Request): Promise<GetSessionsByProctoredUserIdController.Response> {
        const { page } = httpRequest.query!
        const { proctoredUserId} = httpRequest.params!
        const response = await this.getSessionsByProctoredUserId.execute({ page, proctoredUserId })
        return ok(response)

    }

}

export namespace GetSessionsByProctoredUserIdController {
    export type Request = HttpRequest<GetSessionsByProctoredUserIdInterface.Request>
    export type Response = HttpResponse<GetSessionsByProctoredUserIdInterface.Response>
}