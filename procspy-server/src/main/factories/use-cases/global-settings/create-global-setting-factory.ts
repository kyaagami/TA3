import { CreateGlobalSettingInterface } from "@application/interfaces/use-cases/global-settings/CreateProctoredUserInterface"
import { CreateGlobalSetting } from "@application/use-cases/global-settings/CreateGlobalSetting"
import { GlobalSettingRepository } from "@infra/db/mongodb/repositories/GlobalSettingRepository"


export const makeCreateGlobalSetting = (): CreateGlobalSettingInterface => {
    const flagRepository = new GlobalSettingRepository()
    const getGlobalSettingByKeyRepository = new GlobalSettingRepository()
    return new CreateGlobalSetting(flagRepository, getGlobalSettingByKeyRepository)
}