import { UpdateSessionInterface } from "@application/interfaces/use-cases/sessions/UpdateSessionInterface";
import { notFound, ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { SessionLockedError } from "@application/errors/SesionLockedError";



export class UpdateSessionController extends BaseController {

    constructor(
        private readonly UpdateSessionValidation: Validation,
        private readonly UpdateSession: UpdateSessionInterface
    ) {
        super(UpdateSessionValidation)
    }

    async execute(httpRequest: UpdateSessionController.Request): Promise<UpdateSessionController.Response> {
        const sessionData = httpRequest.body!
        
        const response = await this.UpdateSession.execute(sessionData)
        
        if(response instanceof SessionNotExistError || response instanceof SessionLockedError){
            return notFound(response)
        }

        return ok(response)
    }

}

export namespace UpdateSessionController {
    export type Request = HttpRequest<UpdateSessionInterface.Request>
    export type Response = HttpResponse<UpdateSessionInterface.Response>
}