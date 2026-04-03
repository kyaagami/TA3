import { Log, LogProps } from "@domain/entities/Log"
import { RoomProps } from "../../../../domain/entities/Room"


export interface UpdateLogRepository{
    updateLog(logData: UpdateLogRepository.Request): Promise<UpdateLogRepository.Response>
}

export namespace UpdateLogRepository {
    export type Request = Omit<LogProps, 'timestamp' | 'sessionId' >
    export type Response = Log | null
}