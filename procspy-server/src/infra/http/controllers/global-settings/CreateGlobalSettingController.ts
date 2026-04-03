import { Validation } from "@infra/http/interfaces/Validation"
import { BaseController } from "../BaseController"
import { CreateGlobalSettingInterface } from "@application/interfaces/use-cases/global-settings/CreateProctoredUserInterface"
import { GlobalSettingAlreadyExistError } from "@application/errors/GlobalSettingAlreadyExistError"
import { ok, unauthorized } from "@infra/http/helpers/http"
import { HttpRequest } from "@infra/http/interfaces/HttpRequest"
import { HttpResponse } from "@infra/http/interfaces/HttpResponse"



export class CreateGlobalSettingController extends BaseController {

    constructor(
        private readonly createGlobalSettingValidation: Validation,
        private readonly createGlobalSetting: CreateGlobalSettingInterface
    ) {
        super(createGlobalSettingValidation)
    }

    async execute(httpRequest: CreateGlobalSettingController.Request): Promise<CreateGlobalSettingController.Response> {
        const { key,value } = httpRequest.body!
        const idOrError = await this.createGlobalSetting.execute({
            key, value
        })
        if (idOrError instanceof GlobalSettingAlreadyExistError) {
            return unauthorized(idOrError)
        } else {
            return ok({ id: idOrError })
        }

    }

}

export namespace CreateGlobalSettingController {
    export type Request = HttpRequest<CreateGlobalSettingInterface.Request>
    export type Response = HttpResponse<{ id: string } | GlobalSettingAlreadyExistError>
}