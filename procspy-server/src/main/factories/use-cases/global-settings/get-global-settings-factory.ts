import { GetGlobalSettingsInterface } from "@application/interfaces/use-cases/global-settings/GetGlobalSettingsInterface"
import { GetGlobalSettings } from "@application/use-cases/global-settings/GetGlobalSettings"
import { GlobalSettingRepository } from "@infra/db/mongodb/repositories/GlobalSettingRepository"
import { ProctoredUserRepository } from "@infra/db/mongodb/repositories/ProctoredUserRepository"



export const makeGetGlobalSettings = (): GetGlobalSettingsInterface => {
    const globalSettingRepository = new GlobalSettingRepository()
    return new GetGlobalSettings(globalSettingRepository)
}