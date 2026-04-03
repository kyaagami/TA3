import { GetSessionByTokenInterface } from "@application/interfaces/use-cases/sessions/GetSessionByTokenInterface";
import { notFound, ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";
import { GetProctoredUserDetailLogByTokenInterface } from "@application/interfaces/use-cases/etc/GetProctoredUserDetailLogByTokenInterface";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";



export class GetProctoredUserDetailLogByTokenController extends BaseController {

    constructor(
        private readonly getProctoredUserDetailLogByTokenByTokenValidation: Validation,
        private readonly getProctoredUserDetailLogByTokenByToken: GetProctoredUserDetailLogByTokenInterface
    ) {
        super(getProctoredUserDetailLogByTokenByTokenValidation)
    }

    async execute(httpRequest: GetProctoredUserDetailLogByTokenController.Request): Promise<GetProctoredUserDetailLogByTokenController.Response> {
        const { token } = httpRequest.params!
        const response = await this.getProctoredUserDetailLogByTokenByToken.execute(token)
        if(response instanceof SessionNotExistError){
            return notFound(response)
        }

        return ok(response)

    }

}

export namespace GetProctoredUserDetailLogByTokenController {
    export type Request = HttpRequest<GetProctoredUserDetailLogByTokenInterface.Request>
    export type Response = HttpResponse<GetProctoredUserDetailLogByTokenInterface.Response>
}