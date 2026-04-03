import { BaseController } from "@infra/http/controllers/BaseController"
import { GetGlobalSettingsController } from "@infra/http/controllers/global-settings/GetGlobalSettingsController"
import { makeCreateLog } from "@main/factories/use-cases/logs/create-log-factory"
import { makeGetGlobalSettingsValidation } from "./validation-factory"
import { makeGetGlobalSettings } from "@main/factories/use-cases/global-settings/get-global-settings-factory"


export const makeGetGlobalSettingsController = (): BaseController => {
    const validation = makeGetGlobalSettingsValidation()
    const useCase = makeGetGlobalSettings()

    return new GetGlobalSettingsController(validation, useCase)
}