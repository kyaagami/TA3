import { ProctoredUserProps } from "@domain/entities/ProctoredUser"


export interface CreateProctoredUserRepository{
    createProctoredUser(proctoredUserData: CreateProctoredUserRepository.Request): Promise<CreateProctoredUserRepository.Response>
}

export namespace CreateProctoredUserRepository {
    export type Request = Omit<ProctoredUserProps, 'id' | 'createdAt' >
    export type Response = string
}