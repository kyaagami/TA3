import { GlobalSetting, GlobalSettingProps } from "@domain/entities/GlobalSetting"


export interface UpdateGlobalSettingRepository{
    updateGlobalSetting(data: UpdateGlobalSettingRepository.Request): Promise<UpdateGlobalSettingRepository.Response>
}

export namespace UpdateGlobalSettingRepository {
    export type Request = GlobalSettingProps
    export type Response = GlobalSetting | null
}