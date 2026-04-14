import { GetRecentLogsRepository } from "@application/interfaces/repositories/logs/GetRecentLogsRepository"
import { GetRecentLogsInterface } from "@application/interfaces/use-cases/logs/GetRecentLogsInterface"

export class GetRecentLogs implements GetRecentLogsInterface {
    constructor(
        private readonly getRecentLogsRepository: GetRecentLogsRepository,
    ) { }

    async execute(body: GetRecentLogsInterface.Request): Promise<GetRecentLogsInterface.Response> {
        const { limit = 10 } = body
        return this.getRecentLogsRepository.getRecentLogs({ limit })
    }
}
