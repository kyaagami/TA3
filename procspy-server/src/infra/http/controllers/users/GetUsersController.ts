import { Validation } from "@infra/http/interfaces/Validation"
import { BaseController } from "../BaseController"
import { GetUsersInterface } from "@application/interfaces/use-cases/users/GetUsersInterface"
import { ok } from "@infra/http/helpers/http"
import { HttpRequest } from "@infra/http/interfaces/HttpRequest"
import { HttpResponse } from "@infra/http/interfaces/HttpResponse"



export class GetUsersController extends BaseController {

    constructor(
        private readonly getUsersValidation: Validation,
        private readonly getUsers: GetUsersInterface
    ) {
        super(getUsersValidation)
    }

    async execute(httpRequest: GetUsersController.Request): Promise<GetUsersController.Response> {
        const { page, paginationLimit } = httpRequest.query!
        const { proctoredUserId} = httpRequest.params!
        const response = await this.getUsers.execute({ page, paginationLimit })
        return ok(response)

    }

}

export namespace GetUsersController {
    export type Request = HttpRequest<GetUsersInterface.Request>
    export type Response = HttpResponse<GetUsersInterface.Response>
}