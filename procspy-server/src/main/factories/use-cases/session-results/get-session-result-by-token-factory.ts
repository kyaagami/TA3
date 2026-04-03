import { GetSessionResultByTokenInterface } from "@application/interfaces/use-cases/session-results/GetSessionResultByTokenInterface"
import { GetSessionResultByToken } from "@application/use-cases/session-results/GetSessionResultByToken"
import { SessionRepository } from "@infra/db/mongodb/repositories/SessionRepository"
import { SessionResultRepository } from "@infra/db/mongodb/repositories/SessionResultRepository"


export const makeGetSessionResultByToken = (): GetSessionResultByTokenInterface => {
    const repo = new SessionResultRepository()
    const sessionRepo = new SessionRepository()
    return new GetSessionResultByToken( sessionRepo, repo)
}