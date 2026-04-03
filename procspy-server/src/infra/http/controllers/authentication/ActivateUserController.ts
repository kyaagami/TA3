import { UnauthorizedError } from "../../../../application/errors/UnauthorizedError";
import { ActivateUserInterface } from "../../../../application/interfaces/use-cases/authentication/ActivateUserInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";



export class ActivateUserController extends BaseController {

    constructor(
        private readonly activateUserValidation: Validation,
        private readonly activateUser: ActivateUserInterface
    ) {
        super(activateUserValidation)
    }

    async execute(httpRequest: ActivateUserController.Request): Promise<ActivateUserController.Response> {
        const { id } = httpRequest.params!
        const userOrError = await this.activateUser.execute(id)
        if (userOrError instanceof UnauthorizedError) {
            return unauthorized(userOrError)
        } else {
            return ok(userOrError)
        }

    }

}

export namespace ActivateUserController {
    export type Request = HttpRequest<ActivateUserInterface.Request>
    export type Response = HttpResponse<ActivateUserInterface.Response>
}