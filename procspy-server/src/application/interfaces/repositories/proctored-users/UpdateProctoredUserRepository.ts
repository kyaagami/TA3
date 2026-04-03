import { ProctoredUser, ProctoredUserProps } from "@domain/entities/ProctoredUser"


export interface UpdateProctoredUserRepository{
    updateProctoredUser(data: UpdateProctoredUserRepository.Request): Promise<UpdateProctoredUserRepository.Response>
}

export namespace UpdateProctoredUserRepository {
    export type Request = Omit<ProctoredUserProps, 'createdAt' >
    export type Response = ProctoredUser | null
}