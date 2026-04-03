import { CreateLogByTokenInterface } from "@application/interfaces/use-cases/logs/CreateLogByTokenInterface"
import { CreateLog } from "@application/use-cases/logs/CreateLog"
import { CreateLogByToken } from "@application/use-cases/logs/CreateLogByToken"
import { LogRepository } from "@infra/db/mongodb/repositories/LogRepository"
import { RoomRepository } from "@infra/db/mongodb/repositories/RoomRepository"
import { SessionRepository } from "@infra/db/mongodb/repositories/SessionRepository"


export const makeCreateLogByToken = (): CreateLogByTokenInterface => {
    const logRepository = new LogRepository()
    const sessionRepository = new SessionRepository()
    return new CreateLogByToken(logRepository, sessionRepository)
}