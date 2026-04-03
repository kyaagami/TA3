import { GetLogsByTokenInterface } from "@application/interfaces/use-cases/logs/GetLogsByTokenInterface"
import { GetLogsByToken } from "@application/use-cases/logs/GetLogsByToken"
import { LogRepository } from "@infra/db/mongodb/repositories/LogRepository"
import { SessionRepository } from "@infra/db/mongodb/repositories/SessionRepository"



export const makeGetLogsByToken = (): GetLogsByTokenInterface => {
    const repo = new LogRepository()
    const sessionRepo = new SessionRepository()
    return new GetLogsByToken(sessionRepo, repo)
}