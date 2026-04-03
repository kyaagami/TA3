import { UpdateSessionStatusInterface } from "@application/interfaces/use-cases/sessions/UpdateSessionStatusInterface";
import { notFound, ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { SessionLockedError } from "@application/errors/SesionLockedError";
import { SessionStatusError } from "@application/errors/SessionStatusError";



export class UpdateSessionStatusController extends BaseController {

    constructor(
        private readonly updateSessionStatusValidation: Validation,
        private readonly updateSessionStatus: UpdateSessionStatusInterface
    ) {
        super(updateSessionStatusValidation)
    }

    async execute(httpRequest: UpdateSessionStatusController.Request): Promise<UpdateSessionStatusController.Response> {
        const {token , status} = httpRequest.params!
        
        const response = await this.updateSessionStatus.execute({token, status})
        
        if(response instanceof SessionNotExistError || response instanceof SessionStatusError || response instanceof SessionLockedError){
            return notFound(response)
        }

        return ok(response)
    }

}

export namespace UpdateSessionStatusController {
    export type Request = HttpRequest<UpdateSessionStatusInterface.Request>
    export type Response = HttpResponse<UpdateSessionStatusInterface.Response>
}