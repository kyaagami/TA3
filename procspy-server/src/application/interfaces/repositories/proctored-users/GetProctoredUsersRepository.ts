import { ProctoredUser } from "@domain/entities/ProctoredUser";


export interface GetProctoredUsersRepository{
    getProctoredUsers(params: GetProctoredUsersRepository.Request): Promise<GetProctoredUsersRepository.Response>
}

export namespace GetProctoredUsersRepository {
    export type Request  = { page: number, paginationLimit: number }
    export type Response =  { data: ProctoredUser[], page: number, total: number, totalPages: number };
}