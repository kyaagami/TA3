import { UpdateLogByIdInterface } from "@application/interfaces/use-cases/logs/UpdateLogByIdInterface";
import { badRequest, noContent, ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { LogNotExistError } from "@application/errors/LogNotExistError";
import { Log } from "@domain/entities/Log";
import { CreateOrUpdateSessionResultInterface } from "@application/interfaces/use-cases/session-results/CreateOrUpdateSessionResultInterface";
import { LogNotUpdatedError } from "@application/errors/LogNotUpdatedError";



export class UpdateLogByIdController extends BaseController {

    constructor(
        private readonly updateLogByIdValidation: Validation,
        private readonly updateLogById: UpdateLogByIdInterface,
        private readonly createOrUpdateSessionResult: CreateOrUpdateSessionResultInterface
    ) {
        super(updateLogByIdValidation)
    }

    async execute(httpRequest: UpdateLogByIdController.Request): Promise<UpdateLogByIdController.Response> {
        const { id, logType } = httpRequest.body!
        const idOrError = await this.updateLogById.execute({id, logType})

        
        if (idOrError instanceof LogNotExistError) {
            return unauthorized(idOrError)
        } else if (idOrError instanceof LogNotUpdatedError){
            return badRequest(idOrError)
        }
        else{
            const updateSessionResult = await this.createOrUpdateSessionResult.execute({sessionId: idOrError.sessionId, flagKey: idOrError.flagKey!, logType: idOrError.logType, prevLogType: idOrError.prevLogType})
            
            return ok(idOrError)
        }

    }

}

export namespace UpdateLogByIdController {
    export type Request = HttpRequest<UpdateLogByIdInterface.Request>
    export type Response = HttpResponse<Log | LogNotExistError | LogNotUpdatedError>
}