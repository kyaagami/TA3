import { Validation } from "@infra/http/interfaces/Validation"
import { BaseController } from "../BaseController"
import { CreateSessionInterface } from "@application/interfaces/use-cases/sessions/CreateSessionInterface"
import { SessionAlreadyExistError } from "@application/errors/SessionAlreadyExistError"
import { ok, unauthorized } from "@infra/http/helpers/http"
import { HttpRequest } from "@infra/http/interfaces/HttpRequest"
import { HttpResponse } from "@infra/http/interfaces/HttpResponse"


export class CreateSessionController extends BaseController {

    constructor(
        private readonly createSessionValidation: Validation,
        private readonly createSession: CreateSessionInterface
    ) {
        super(createSessionValidation)
    }

    async execute(httpRequest: CreateSessionController.Request): Promise<CreateSessionController.Response> {
        const { proctoredUserId, roomId} = httpRequest.body!
        const idOrError = await this.createSession.execute({ proctoredUserId, roomId })
        if (idOrError instanceof SessionAlreadyExistError) {
            return unauthorized(idOrError)
        } else {
            return ok({ id: idOrError })
        }

    }

}

export namespace CreateSessionController {
    export type Request = HttpRequest<CreateSessionInterface.Request>
    export type Response = HttpResponse<{ id: string } | SessionAlreadyExistError>
}