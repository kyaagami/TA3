import { paginationConfig } from "@application/config/pagination";
import { GetSessionsByProctoredUserIdRepository } from "@application/interfaces/repositories/sessions/GetSessionsByProctoredUserIdRepository";
import { GetSessionsByProctoredUserIdInterface } from "@application/interfaces/use-cases/sessions/GetSessionsByProctoredUserId";


export class GetSessionsByProctoredUserId implements GetSessionsByProctoredUserIdInterface {
    constructor(
        private readonly getSessionsByProctoredUserIdRepository: GetSessionsByProctoredUserIdRepository,
    ) { }

    async execute(body: GetSessionsByProctoredUserIdInterface.Request): Promise<GetSessionsByProctoredUserIdInterface.Response> {
        const { page = 1, proctoredUserId } = body
        const { paginationLimit } = paginationConfig;

        return this.getSessionsByProctoredUserIdRepository.getSessionsByProctoredUserId({proctoredUserId, page, paginationLimit})
    }
}