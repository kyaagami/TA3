import { GlobalSetting, GlobalSettingProps } from "@domain/entities/GlobalSetting"


export interface GetGlobalSettingByKeyRepository{
    getGlobalSettingByKey(identifier: GetGlobalSettingByKeyRepository.Request): Promise<GetGlobalSettingByKeyRepository.Response>
}

export namespace GetGlobalSettingByKeyRepository {
    export type Request = string
    export type Response = GlobalSetting | null
}