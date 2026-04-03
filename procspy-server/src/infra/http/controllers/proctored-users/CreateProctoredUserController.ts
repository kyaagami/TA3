import { CreateProctoredUserInterface } from "@application/interfaces/use-cases/proctored-users/CreateProctoredUserInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { IdentifierInUseError } from "@application/errors/IdentifierInUseError";



export class CreateProctoredUserController extends BaseController {

    constructor(
        private readonly createProctoredUserValidation: Validation,
        private readonly createProctoredUser: CreateProctoredUserInterface
    ) {
        super(createProctoredUserValidation)
    }

    async execute(httpRequest: CreateProctoredUserController.Request): Promise<CreateProctoredUserController.Response> {
        const { email, identifier,name } = httpRequest.body!
        const idOrError = await this.createProctoredUser.execute({ email, identifier,name })
        if (idOrError instanceof IdentifierInUseError) {
            return unauthorized(idOrError)
        } else {
            return ok({ id: idOrError })
        }

    }

}

export namespace CreateProctoredUserController {
    export type Request = HttpRequest<CreateProctoredUserInterface.Request>
    export type Response = HttpResponse<{ id: string } | IdentifierInUseError>
}