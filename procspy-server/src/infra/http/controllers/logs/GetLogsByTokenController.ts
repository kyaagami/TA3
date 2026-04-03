import { GetLogsByTokenInterface } from "@application/interfaces/use-cases/logs/GetLogsByTokenInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";



export class GetLogsByTokenController extends BaseController {

    constructor(
        private readonly getLogsByTokenValidation: Validation,
        private readonly getLogsByToken: GetLogsByTokenInterface
    ) {
        super(getLogsByTokenValidation)
    }

    async execute(httpRequest: GetLogsByTokenController.Request): Promise<GetLogsByTokenController.Response> {
        const { page, paginationLimit } = httpRequest.query!
        const { token} = httpRequest.params!
        const response = await this.getLogsByToken.execute({ page, token, paginationLimit })
        return ok(response)
    }

}

export namespace GetLogsByTokenController {
    export type Request = HttpRequest<GetLogsByTokenInterface.Request>
    export type Response = HttpResponse<GetLogsByTokenInterface.Response>
}