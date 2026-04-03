import { ProctoredUser, ProctoredUserProps } from "@domain/entities/ProctoredUser"


export interface GetProctoredUserByIdentifierRepository{
    getProctoredUserByIdentifier(identifier: GetProctoredUserByIdentifierRepository.Request): Promise<GetProctoredUserByIdentifierRepository.Response>
}

export namespace GetProctoredUserByIdentifierRepository {
    export type Request = string
    export type Response = ProctoredUser | null
}