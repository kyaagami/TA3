import { GlobalSetting } from "@domain/entities/GlobalSetting";
import { UseCase } from "../UseCase";


export interface GetGlobalSettingsInterface extends UseCase<GetGlobalSettingsInterface.Request, GetGlobalSettingsInterface.Response> {

    execute(params: GetGlobalSettingsInterface.Request): Promise<GetGlobalSettingsInterface.Response>

}

export namespace GetGlobalSettingsInterface {
    export type Request = { page?: number, paginationLimit? :number};
    export type Response = { data: GlobalSetting[], page: number, total: number, totalPages: number };
}