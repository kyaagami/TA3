import { BaseController } from "@infra/http/controllers/BaseController"
import { makeCreateGlobalSettingValidation } from "./validation-factory"
import { CreateGlobalSettingController } from "@infra/http/controllers/global-settings/CreateGlobalSettingController"
import { makeCreateGlobalSetting } from "@main/factories/use-cases/global-settings/create-global-setting-factory"


export const makeCreateGlobalSettingController = (): BaseController => {
    const validation = makeCreateGlobalSettingValidation()
    const useCase = makeCreateGlobalSetting()

    return new CreateGlobalSettingController(validation, useCase)
}