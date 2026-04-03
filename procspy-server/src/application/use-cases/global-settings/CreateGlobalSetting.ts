import { GlobalSettingAlreadyExistError } from "@application/errors/GlobalSettingAlreadyExistError"
import { IdentifierInUseError } from "@application/errors/IdentifierInUseError"
import { CreateGlobalSettingRepository } from "@application/interfaces/repositories/global-settings/CreateGlobalSettingRepository"
import { GetGlobalSettingByKeyRepository } from "@application/interfaces/repositories/global-settings/GetGlobalSettingByKeyRepository"
import { CreateGlobalSettingInterface } from "@application/interfaces/use-cases/global-settings/CreateProctoredUserInterface"


export class CreateGlobalSetting implements CreateGlobalSettingInterface {
    constructor(
        private readonly createGlobalSettingRepository: CreateGlobalSettingRepository,
        private readonly getGlobalSettingByKeyRepository: GetGlobalSettingByKeyRepository
    ) { }

    async execute(body: CreateGlobalSettingInterface.Request): Promise<CreateGlobalSettingInterface.Response> {
        const {key, value} = body

        const globalSettingKeyIsExist = await this.getGlobalSettingByKeyRepository.getGlobalSettingByKey(key)

        if(globalSettingKeyIsExist){
            return new GlobalSettingAlreadyExistError()
        }

        const newGlobalSetting = await this.createGlobalSettingRepository.createGlobalSetting({key, value})
        
        return newGlobalSetting
    }
}