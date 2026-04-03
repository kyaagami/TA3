import { UpdateLogByIdInterface } from "@application/interfaces/use-cases/logs/UpdateLogByIdInterface"
import { UpdateLogById } from "@application/use-cases/logs/UpdateLogById"
import { LogRepository } from "@infra/db/mongodb/repositories/LogRepository"
import { SessionRepository } from "@infra/db/mongodb/repositories/SessionRepository"


export const makeUpdateLogById = (): UpdateLogByIdInterface => {
    const logRepository = new LogRepository()
    return new UpdateLogById(logRepository, logRepository)
}