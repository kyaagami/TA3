import { GlobalSettingProps } from "@domain/entities/GlobalSetting"


export interface CreateGlobalSettingRepository{
    createGlobalSetting(globalSettingData: CreateGlobalSettingRepository.Request): Promise<CreateGlobalSettingRepository.Response>
}

export namespace CreateGlobalSettingRepository {
    export type Request = Omit<GlobalSettingProps, 'id' >
    export type Response = string
}