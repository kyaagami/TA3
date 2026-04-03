import { CreateLogByTokenInterface } from "@application/interfaces/use-cases/logs/CreateLogByTokenInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { CreateOrUpdateSessionResultInterface } from "@application/interfaces/use-cases/session-results/CreateOrUpdateSessionResultInterface";



export class CreateLogByTokenController extends BaseController {

    constructor(
        private readonly createLogByTokenValidation: Validation,
        private readonly createLogByToken: CreateLogByTokenInterface,
        private readonly createOrUpdateSessionResult: CreateOrUpdateSessionResultInterface

    ) {
        super(createLogByTokenValidation)
    }

    async execute(httpRequest: CreateLogByTokenController.Request): Promise<CreateLogByTokenController.Response> {
        const { token, flagKey, attachment, logType } = httpRequest.body!
        const idOrError = await this.createLogByToken.execute({
            attachment, token, flagKey, logType
        })
        if (idOrError instanceof SessionNotExistError) {
            return unauthorized(idOrError)
        } else {
            const updateSessionResult = await this.createOrUpdateSessionResult.execute({sessionId: idOrError.sessionId, flagKey: idOrError.flagKey!, logType: idOrError.logType})
            return ok({ id: idOrError.id })
        }

    }

}

export namespace CreateLogByTokenController {
    export type Request = HttpRequest<CreateLogByTokenInterface.Request>
    export type Response = HttpResponse<{ id: string } | SessionNotExistError>
}