import { GetSessionsByRoomIdInterface } from "@application/interfaces/use-cases/sessions/GetSessionsByRoomIdInterface"
import { GetSessionsByRoomId } from "@application/use-cases/sessions/GetSessionsByRoomId"
import { SessionRepository } from "@infra/db/mongodb/repositories/SessionRepository"



export const makeGetSessionsByRoomId = (): GetSessionsByRoomIdInterface => {
    const repo = new SessionRepository()
    return new GetSessionsByRoomId(repo)
}