import { UnauthorizedError } from "../../../../application/errors/UnauthorizedError";
import { SignInInterface } from "../../../../application/interfaces/use-cases/authentication/SignInInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";



export class SignInController extends BaseController {

    constructor(
        private readonly signInValidation: Validation,
        private readonly signIn: SignInInterface
    ) {
        super(signInValidation)
    }

    async execute(httpRequest: SignInController.Request): Promise<SignInController.Response> {
        const { email, password } = httpRequest.body!
        const authenticationTokenOrError = await this.signIn.execute({ email, password })
        if (authenticationTokenOrError instanceof UnauthorizedError) {
            return unauthorized(authenticationTokenOrError)
        } else {
            return ok({ authenticationToken: authenticationTokenOrError })
        }

    }

}

export namespace SignInController {
    export type Request = HttpRequest<SignInInterface.Request>
    export type Response = HttpResponse<{ authenticationToken: string } | UnauthorizedError>
}