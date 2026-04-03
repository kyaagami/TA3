import { UpdateGlobalSettingInterface } from "@application/interfaces/use-cases/global-settings/UpdateGlobalSettingInterface"
import { UpdateGlobalSetting } from "@application/use-cases/global-settings/UpdateGlobalSetting"
import { GlobalSettingRepository } from "@infra/db/mongodb/repositories/GlobalSettingRepository"


export const makeUpdateGlobalSetting = (): UpdateGlobalSettingInterface => {
    const globalSettingByKeyRepository = new GlobalSettingRepository()
    return new UpdateGlobalSetting(globalSettingByKeyRepository, globalSettingByKeyRepository)
}