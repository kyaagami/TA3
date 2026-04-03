import { EnrichedSession } from "@application/interfaces/use-cases/sessions/GetSessionsByProctoredUserId";
import { Session } from "@domain/entities/Session"


export interface GetSessionsByProctoredUserIdRepository{
    getSessionsByProctoredUserId(proctoredUserId: GetSessionsByProctoredUserIdRepository.Request): Promise<GetSessionsByProctoredUserIdRepository.Response>
}

export namespace GetSessionsByProctoredUserIdRepository {
    export type Request  = {proctoredUserId: string, page: number, paginationLimit: number }
        export type Response =  { data: EnrichedSession[], page: number, total: number, totalPages: number };
}