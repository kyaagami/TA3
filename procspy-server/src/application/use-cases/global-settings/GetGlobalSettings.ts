import { paginationConfig } from "@application/config/pagination";
import { GetGlobalSettingsRepository } from "@application/interfaces/repositories/global-settings/GetGlobalSettingsRepository";
import { GetGlobalSettingsInterface } from "@application/interfaces/use-cases/global-settings/GetGlobalSettingsInterface";
import { GetRoomsInterface } from "@application/interfaces/use-cases/rooms/GetRoomsInterface"


export class GetGlobalSettings implements GetGlobalSettingsInterface {
    constructor(
        private readonly getGlobalSettingsRepository: GetGlobalSettingsRepository,
    ) { }

    async execute(body: GetGlobalSettingsInterface.Request): Promise<GetGlobalSettingsInterface.Response> {
        const { page = 1 , paginationLimit = 15} = body

        return this.getGlobalSettingsRepository.getGlobalSettings({page, paginationLimit})
    }
}