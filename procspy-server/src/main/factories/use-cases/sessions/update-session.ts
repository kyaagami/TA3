import { UpdateSessionInterface } from "@application/interfaces/use-cases/sessions/UpdateSessionInterface"
import { UpdateSession } from "@application/use-cases/sessions/UpdateSession"
import { SessionRepository } from "@infra/db/mongodb/repositories/SessionRepository"


export const makeUpdateSession = (): UpdateSessionInterface => {
    const updateSessionRepository = new SessionRepository()
    const GetSessionByIdRepository = new SessionRepository()
    return new UpdateSession(updateSessionRepository, GetSessionByIdRepository)
}