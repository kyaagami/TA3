import { CreateLogInterface } from "@application/interfaces/use-cases/logs/CreateLogIntreface"
import { CreateLog } from "@application/use-cases/logs/CreateLog"
import { LogRepository } from "@infra/db/mongodb/repositories/LogRepository"
import { RoomRepository } from "@infra/db/mongodb/repositories/RoomRepository"
import { SessionRepository } from "@infra/db/mongodb/repositories/SessionRepository"


export const makeCreateLog = (): CreateLogInterface => {
    const logRepository = new LogRepository()
    const sessionRepository = new SessionRepository()
    return new CreateLog(logRepository, sessionRepository)
}