import { CreateOrUpdateSessionDetailInterface } from "@application/interfaces/use-cases/session-details/CreateOrUpdateSessionDetailInterface"
import { CreateOrUpdateSessionDetail } from "@application/use-cases/session-details/CreateOrUpdateSessionDetail"
import { SessionDetailRepository } from "@infra/db/mongodb/repositories/SessionDetailRespository"
import { SessionRepository } from "@infra/db/mongodb/repositories/SessionRepository"


export const makeCreateOrUpdateSessionDetail = (): CreateOrUpdateSessionDetailInterface => {
    const sessionDetailRespository = new SessionDetailRepository()
    const getSessionDetailBySessionId = new SessionDetailRepository()
    const GetSessionByIdRepository = new SessionRepository()
    return new CreateOrUpdateSessionDetail(sessionDetailRespository,getSessionDetailBySessionId, GetSessionByIdRepository)
}