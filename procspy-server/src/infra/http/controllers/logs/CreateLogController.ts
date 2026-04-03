import { CreateLogInterface } from "@application/interfaces/use-cases/logs/CreateLogIntreface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { CreateOrUpdateSessionResultInterface } from "@application/interfaces/use-cases/session-results/CreateOrUpdateSessionResultInterface";



export class CreateLogController extends BaseController {

    constructor(
        private readonly createLogValidation: Validation,
        private readonly createLog: CreateLogInterface
    ) {
        super(createLogValidation)
    }

    async execute(httpRequest: CreateLogController.Request): Promise<CreateLogController.Response> {
        const { sessionId, flagKey, attachment, logType } = httpRequest.body!
        const idOrError = await this.createLog.execute({
            attachment, sessionId, flagKey, logType
        })
        if (idOrError instanceof SessionNotExistError) {
            return unauthorized(idOrError)
        } else {
            return ok({ id: idOrError.id })
        }

    }

}

export namespace CreateLogController {
    export type Request = HttpRequest<CreateLogInterface.Request>
    export type Response = HttpResponse<{ id: string } | SessionNotExistError>
}