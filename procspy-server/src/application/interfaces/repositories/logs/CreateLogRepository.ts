import { Log, LogProps } from "@domain/entities/Log"
import { RoomProps } from "../../../../domain/entities/Room"


export interface CreateLogRepository{
    createLog(logData: CreateLogRepository.Request): Promise<CreateLogRepository.Response>
}

export namespace CreateLogRepository {
    export type Request = Omit<LogProps, 'id' | 'timestamp' >
    export type Response = Log
}