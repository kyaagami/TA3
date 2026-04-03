import { GlobalSetting } from "@domain/entities/GlobalSetting";


export interface GetGlobalSettingsRepository{
    getGlobalSettings(params: GetGlobalSettingsRepository.Request): Promise<GetGlobalSettingsRepository.Response>
}

export namespace GetGlobalSettingsRepository {
    export type Request  = { page: number, paginationLimit: number }
    export type Response =  { data: GlobalSetting[], page: number, total: number, totalPages: number };
}