import { GetLogsByRoomIdInterface } from "@application/interfaces/use-cases/logs/GetLogsByRoomIdInterface"
import { GetLogsByRoomId } from "@application/use-cases/logs/GetLogsByRoomId"
import { LogRepository } from "@infra/db/mongodb/repositories/LogRepository"



export const makeGetLogsByRoomId = (): GetLogsByRoomIdInterface => {
    const repo = new LogRepository()
    return new GetLogsByRoomId(repo)
}