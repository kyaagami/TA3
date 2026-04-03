import { GetSessionByTokenInterface } from "@application/interfaces/use-cases/sessions/GetSessionByTokenInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";



export class GetSessionByTokenController extends BaseController {

    constructor(
        private readonly getSessionByTokenValidation: Validation,
        private readonly getSessionByToken: GetSessionByTokenInterface
    ) {
        super(getSessionByTokenValidation)
    }

    async execute(httpRequest: GetSessionByTokenController.Request): Promise<GetSessionByTokenController.Response> {
        const { token } = httpRequest.params!
        const response = await this.getSessionByToken.execute(token)
        return ok(response)

    }

}

export namespace GetSessionByTokenController {
    export type Request = HttpRequest<GetSessionByTokenInterface.Request>
    export type Response = HttpResponse<GetSessionByTokenInterface.Response>
}