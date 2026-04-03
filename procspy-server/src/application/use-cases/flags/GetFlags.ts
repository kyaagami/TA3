import { paginationConfig } from "@application/config/pagination";
import { GetFlagsRepository } from "@application/interfaces/repositories/flags/GetFlagsRepository";
import { GetFlagsInterface } from "@application/interfaces/use-cases/flags/GetFlagsInterface";


export class GetFlags implements GetFlagsInterface {
    constructor(
        private readonly getFlagsRepository: GetFlagsRepository,
    ) { }

    async execute(body: GetFlagsInterface.Request): Promise<GetFlagsInterface.Response> {
        const { page = 1 } = body
        const { paginationLimit } = paginationConfig;

        return this.getFlagsRepository.getFlags({page, paginationLimit})
    }
}