import { Validation } from "@infra/http/interfaces/Validation"
import { BaseController } from "../BaseController"
import { GetFlagsInterface } from "@application/interfaces/use-cases/flags/GetFlagsInterface"
import { HttpRequest } from "@infra/http/interfaces/HttpRequest"
import { HttpResponse } from "@infra/http/interfaces/HttpResponse"
import { ok } from "@infra/http/helpers/http"




export class GetFlagsController extends BaseController {

    constructor(
        private readonly getFlagsValidation: Validation,
        private readonly getFlags: GetFlagsInterface
    ) {
        super(getFlagsValidation)
    }

    async execute(httpRequest: GetFlagsController.Request): Promise<GetFlagsController.Response> {
        const { page } = httpRequest.params!
        const response = await this.getFlags.execute({
            page
        })

        return ok(response)


    }

}

export namespace GetFlagsController {
    export type Request = HttpRequest<undefined, { page?: number }>
    export type Response = HttpResponse<GetFlagsInterface.Response>
}