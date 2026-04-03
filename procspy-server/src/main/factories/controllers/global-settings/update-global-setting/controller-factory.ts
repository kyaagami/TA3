import { BaseController } from "@infra/http/controllers/BaseController"
import { makeCreateGlobalSetting } from "@main/factories/use-cases/global-settings/create-global-setting-factory"
import { makeUpdateGlobalSettingValidation } from "./validation-factory"
import { UpdateGlobalSettingController } from "@infra/http/controllers/global-settings/UpdateGlobalSettingController"
import { makeUpdateGlobalSetting } from "@main/factories/use-cases/global-settings/update-global-setting-factory"


export const makeUpdateGlobalSettingController = (): BaseController => {
    const validation = makeUpdateGlobalSettingValidation()
    const useCase = makeUpdateGlobalSetting()

    return new UpdateGlobalSettingController(validation, useCase)
}