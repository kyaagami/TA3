import { GetSessionResultByTokenInterface } from "@application/interfaces/use-cases/session-results/GetSessionResultByTokenInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";



export class GetSessionResultByTokenController extends BaseController {

    constructor(
        private readonly getSessionResultByTokenValidation: Validation,
        private readonly getSessionResultByToken: GetSessionResultByTokenInterface
    ) {
        super(getSessionResultByTokenValidation)
    }

    async execute(httpRequest: GetSessionResultByTokenController.Request): Promise<GetSessionResultByTokenController.Response> {
        const { token } = httpRequest.params!
        const response = await this.getSessionResultByToken.execute(token)
        return ok(response)

    }

}

export namespace GetSessionResultByTokenController {
    export type Request = HttpRequest<GetSessionResultByTokenInterface.Request>
    export type Response = HttpResponse<GetSessionResultByTokenInterface.Response>
}