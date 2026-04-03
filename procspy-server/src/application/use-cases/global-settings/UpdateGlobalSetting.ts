import { GlobalSettingNotExistError } from "@application/errors/GlobalSettingError";
import { GetGlobalSettingByKeyRepository } from "@application/interfaces/repositories/global-settings/GetGlobalSettingByKeyRepository";
import { GetGlobalSettingsRepository } from "@application/interfaces/repositories/global-settings/GetGlobalSettingsRepository";
import { UpdateGlobalSettingRepository } from "@application/interfaces/repositories/global-settings/UpdateGlobalSettingRepository";
import { UpdateGlobalSettingInterface } from "@application/interfaces/use-cases/global-settings/UpdateGlobalSettingInterface";


export class UpdateGlobalSetting implements UpdateGlobalSettingInterface {
    constructor(
        private readonly getGlobalSettingByKeyRepository: GetGlobalSettingByKeyRepository,
        private readonly updateGlobalSettingRepository: UpdateGlobalSettingRepository
    ) { }

    async execute(credentials: UpdateGlobalSettingInterface.Request): Promise<UpdateGlobalSettingInterface.Response> {
        const {id, key, value} = credentials

        const existGlobalSetting = await this.getGlobalSettingByKeyRepository.getGlobalSettingByKey(key)

        if(!existGlobalSetting){
            return new GlobalSettingNotExistError
        }

        const updatedGlobalSetting = await this.updateGlobalSettingRepository.updateGlobalSetting({id, key, value})

        if(!updatedGlobalSetting){
            return new Error
        }

        return updatedGlobalSetting
    }
}