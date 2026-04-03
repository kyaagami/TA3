import { ProctoredUser, ProctoredUserProps } from "@domain/entities/ProctoredUser"


export interface GetProctoredUserByIdRepository{
    getProctoredUserById(proctoredUserIds: GetProctoredUserByIdRepository.Request): Promise<GetProctoredUserByIdRepository.Response>
}

export namespace GetProctoredUserByIdRepository {
    export type Request = string[]
    export type Response = ProctoredUser[] | null
}