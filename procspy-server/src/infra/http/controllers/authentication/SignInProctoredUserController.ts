import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { UnauthorizedError } from "../../../../application/errors/UnauthorizedError";
import { SignInProctoredUserInterface } from "../../../../application/interfaces/use-cases/authentication/SignInProctoredUserInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { ProctoredUser } from "@domain/entities/ProctoredUser";
import { Session } from "@domain/entities/Session";
import { SessionEndedError } from "@application/errors/SessionEndedError";



export class SignInProctoredUserController extends BaseController {

    constructor(
        private readonly signInValidation: Validation,
        private readonly signIn: SignInProctoredUserInterface
    ) {
        super(signInValidation)
    }

    async execute(httpRequest: SignInProctoredUserController.Request): Promise<SignInProctoredUserController.Response> {
        const { token } = httpRequest.params!
        const sessionDataOrError = await this.signIn.execute({ token })
        if (sessionDataOrError instanceof SessionNotExistError || sessionDataOrError instanceof SessionEndedError) {
            return unauthorized(sessionDataOrError)
        } else {
            return ok({...sessionDataOrError})
        }

    }

}

export namespace SignInProctoredUserController {
    export type Request = HttpRequest<SignInProctoredUserInterface.Request>
    export type Response = HttpResponse<{ session: Omit<Session , 'id'>, user: Omit<ProctoredUser, 'id'>} | SessionNotExistError | SessionEndedError>
}