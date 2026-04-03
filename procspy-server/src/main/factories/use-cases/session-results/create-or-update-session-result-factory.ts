import { CreateOrUpdateSessionResultInterface } from "@application/interfaces/use-cases/session-results/CreateOrUpdateSessionResultInterface"
import { CreateOrUpdateSessionResult } from "@application/use-cases/session-results/CreateOrUpdateSessionResult"
import { FlagRepository } from "@infra/db/mongodb/repositories/FlagRepository"
import { GlobalSettingRepository } from "@infra/db/mongodb/repositories/GlobalSettingRepository"
import { SessionRepository } from "@infra/db/mongodb/repositories/SessionRepository"
import { SessionResultRepository } from "@infra/db/mongodb/repositories/SessionResultRepository"


export const makeCreateOrUpdateSessionResult = (): CreateOrUpdateSessionResultInterface => {
    const sessionResultRespository = new SessionResultRepository()
    const globalSettingRepository = new GlobalSettingRepository()
    const flagRepository = new FlagRepository()
    return new CreateOrUpdateSessionResult(sessionResultRespository, sessionResultRespository, sessionResultRespository,flagRepository, globalSettingRepository )
}