import { BaseController } from "@infra/http/controllers/BaseController"
import { GetRecentLogsController } from "@infra/http/controllers/logs/GetRecentLogsController"
import { makeGetRecentLogs } from "@main/factories/use-cases/logs/get-recent-logs-factory"

export const makeGetRecentLogsController = (): BaseController => {
    const useCase = makeGetRecentLogs()
    return new GetRecentLogsController(useCase)
}
