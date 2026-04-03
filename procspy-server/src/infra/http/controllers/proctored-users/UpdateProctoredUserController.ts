
import { UpdateProctoredUserInterface } from "@application/interfaces/use-cases/proctored-users/UpdateProctoredUserInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { ProctoredUserNotExistError } from "@application/errors/ProctoredUserNotExistError";



export class UpdateProctoredUserController extends BaseController {

    constructor(
        private readonly updateProctoredUserValidation: Validation,
        private readonly updateProctoredUser: UpdateProctoredUserInterface
    ) {
        super(updateProctoredUserValidation)
    }

    async execute(httpRequest: UpdateProctoredUserController.Request): Promise<UpdateProctoredUserController.Response> {
        const { id, email, identifier,name } = httpRequest.body!
        const idOrError = await this.updateProctoredUser.execute({ id, email, identifier,name })
        if (idOrError instanceof ProctoredUserNotExistError) {
            return unauthorized(idOrError)
        } else {
            return ok(idOrError)
        }

    }

}

export namespace UpdateProctoredUserController {
    export type Request = HttpRequest<UpdateProctoredUserInterface.Request>
    export type Response = HttpResponse<{ id: string } | ProctoredUserNotExistError>
}