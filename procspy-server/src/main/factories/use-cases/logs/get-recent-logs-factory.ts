import { GetRecentLogs } from "@application/use-cases/logs/GetRecentLogs"
import { LogRepository } from "@infra/db/mongodb/repositories/LogRepository"

export const makeGetRecentLogs = () => {
    const logRepository = new LogRepository()
    return new GetRecentLogs(logRepository)
}
