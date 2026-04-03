import { Session } from "@domain/entities/Session"


export interface GetActiveSessionsByProctoredUserIdRepository{
    getActiveSessionsByProctoredUserId(proctoredUserId: GetActiveSessionsByProctoredUserIdRepository.Request): Promise<GetActiveSessionsByProctoredUserIdRepository.Response>
}

export namespace GetActiveSessionsByProctoredUserIdRepository {
    export type Request = string
    export type Response = Session[] | null
}