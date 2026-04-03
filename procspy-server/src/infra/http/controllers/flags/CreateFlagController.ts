import { CreateFlagInterface } from "@application/interfaces/use-cases/flags/CreateFlagInterface";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";



export class CreateFlagController extends BaseController {

    constructor(
        private readonly createFlagValidation: Validation,
        private readonly createFlag: CreateFlagInterface
    ) {
        super(createFlagValidation)
    }

    async execute(httpRequest: CreateFlagController.Request): Promise<CreateFlagController.Response> {
        const { flagKey, label, severity } = httpRequest.body!
        const idOrError = await this.createFlag.execute({
            flagKey, label, severity
        })
        if (idOrError instanceof Error) {
            return unauthorized(idOrError)
        } else {
            return ok({ id: idOrError })
        }

    }

}

export namespace CreateFlagController {
    export type Request = HttpRequest<CreateFlagInterface.Request>
    export type Response = HttpResponse<{ id: string } | Error>
}