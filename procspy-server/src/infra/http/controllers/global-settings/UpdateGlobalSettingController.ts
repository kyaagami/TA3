import { Validation } from "@infra/http/interfaces/Validation"
import { BaseController } from "../BaseController"
import { UpdateGlobalSettingInterface } from "@application/interfaces/use-cases/global-settings/UpdateGlobalSettingInterface"
import { HttpRequest } from "@infra/http/interfaces/HttpRequest"
import { GlobalSettingNotExistError } from "@application/errors/GlobalSettingError"
import { GlobalSetting } from "@domain/entities/GlobalSetting"
import { HttpResponse } from "@infra/http/interfaces/HttpResponse"
import { SessionNotExistError } from "@application/errors/SessionNotExistError"
import { badRequest, ok } from "@infra/http/helpers/http"


export class UpdateGlobalSettingController extends BaseController {

    constructor(
        private readonly updateGlobalSettingValidation: Validation,
        private readonly updateGlobalSetting: UpdateGlobalSettingInterface,
        //TODO: add if max_severity updated go fix all session_result
    ) {
        super(updateGlobalSettingValidation)
    }

    async execute(httpRequest: UpdateGlobalSettingController.Request): Promise<UpdateGlobalSettingController.Response> {
        const {id, key , value} = httpRequest.body!

        const dataOrError = await this.updateGlobalSetting.execute({id, key, value})

        if(dataOrError instanceof SessionNotExistError){
            return badRequest(dataOrError)
        }else{
            return ok(dataOrError)
        }
    }

}

export namespace UpdateGlobalSettingController {
    export type Request = HttpRequest<UpdateGlobalSettingInterface.Request>
    export type Response = HttpResponse<GlobalSetting | GlobalSettingNotExistError>
}