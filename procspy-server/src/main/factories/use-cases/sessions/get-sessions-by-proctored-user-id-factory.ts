import { GetSessionsByProctoredUserIdInterface } from "@application/interfaces/use-cases/sessions/GetSessionsByProctoredUserId"
import { GetSessionsByProctoredUserId } from "@application/use-cases/sessions/GetSessionsByProctoredUserId"
import { SessionRepository } from "@infra/db/mongodb/repositories/SessionRepository"



export const makeGetSessionsByProctoredUserId = (): GetSessionsByProctoredUserIdInterface => {
    const repo = new SessionRepository()
    return new GetSessionsByProctoredUserId(repo)
}