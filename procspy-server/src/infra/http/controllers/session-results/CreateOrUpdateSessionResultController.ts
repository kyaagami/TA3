import { GetSessionResultByIdRepository } from "@application/interfaces/repositories/session-results/GetSessionResultRepositoryBySessionIdRepository";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";
import { CreateSessionResultRepository } from "@application/interfaces/repositories/session-results/CreateSessionResultRepository";
import { UpdateSessionResultRepository } from "@application/interfaces/repositories/session-results/UpdateSessionResultRepository";
import { CreateOrUpdateSessionResultInterface } from "@application/interfaces/use-cases/session-results/CreateOrUpdateSessionResultInterface";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";



export class CreateOrUpdateSessionResultController extends BaseController {

    constructor(
        private readonly createOrUpdateSessionResultValidation: Validation,
        private readonly createOrUpdateSessionResultInterface: CreateOrUpdateSessionResultInterface,
        

    ) {
        super(createOrUpdateSessionResultValidation)
    }

    async execute(httpRequest: CreateOrUpdateSessionResultController.Request): Promise<CreateOrUpdateSessionResultController.Response> {
        const body = httpRequest.body!

        const res = await this.createOrUpdateSessionResultInterface.execute(body)

        if(res instanceof SessionNotExistError){
            return unauthorized(res)
        }

        return ok(res)
    }

}

export namespace CreateOrUpdateSessionResultController {
    export type Request = HttpRequest<CreateOrUpdateSessionResultInterface.Request>
    export type Response = HttpResponse<CreateOrUpdateSessionResultInterface.Response>
}