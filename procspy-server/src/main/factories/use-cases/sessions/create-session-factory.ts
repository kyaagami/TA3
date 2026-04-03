import { CreateSessionInterface } from "@application/interfaces/use-cases/sessions/CreateSessionInterface"
import { CreateSession } from "@application/use-cases/sessions/CreateSession"
import { SessionRepository } from "@infra/db/mongodb/repositories/SessionRepository"


export const makeCreateSession = (): CreateSessionInterface => {
    const roomRepository = new SessionRepository()
    const GetSessionByProctoredUserIdRepository = new SessionRepository()
    const getActiveSessionsRepo = new SessionRepository()
    return new CreateSession(roomRepository, GetSessionByProctoredUserIdRepository, getActiveSessionsRepo)
}