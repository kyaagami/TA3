import { UpdateSessionStatusInterface } from "@application/interfaces/use-cases/sessions/UpdateSessionStatusInterface"
import { UpdateSessionStatus } from "@application/use-cases/sessions/UpdateSessionStatus"
import { SessionRepository } from "@infra/db/mongodb/repositories/SessionRepository"


export const makeUpdateSessionStatus = (): UpdateSessionStatusInterface => {
    const updateSessionStatusRepository = new SessionRepository()
    const GetSessionByTokenRepository = new SessionRepository()
    return new UpdateSessionStatus(updateSessionStatusRepository, GetSessionByTokenRepository)
}