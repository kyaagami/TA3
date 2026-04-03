import { DeleteProctoredUserByIdInterface } from "@application/interfaces/use-cases/proctored-users/DeleteProctoredUserByIdInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { ProctoredUserNotExistError } from "@application/errors/ProctoredUserNotExistError";
import { ProctoredUser } from "@domain/entities/ProctoredUser";



export class DeleteProctoredUserByIdController extends BaseController {

    constructor(
        private readonly updateProctoredUserValidation: Validation,
        private readonly updateProctoredUser: DeleteProctoredUserByIdInterface
    ) {
        super(updateProctoredUserValidation)
    }

    async execute(httpRequest: DeleteProctoredUserByIdController.Request): Promise<DeleteProctoredUserByIdController.Response> {
        const { id } = httpRequest.params!
        const idOrError = await this.updateProctoredUser.execute(id)
        if (idOrError instanceof ProctoredUserNotExistError) {
            return unauthorized(idOrError)
        } else {
            return ok({success: idOrError})
        }

    }

}

export namespace DeleteProctoredUserByIdController {
    export type Request = HttpRequest<DeleteProctoredUserByIdInterface.Request>
    export type Response = HttpResponse<{success: boolean} | ProctoredUserNotExistError>
}
