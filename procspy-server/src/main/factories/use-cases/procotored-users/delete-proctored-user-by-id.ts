import { DeleteProctoredUserByIdInterface } from "@application/interfaces/use-cases/proctored-users/DeleteProctoredUserByIdInterface"
import { DeleteProctoredUserById } from "@application/use-cases/proctored-users/DeleteProctoredUserById"
import { ProctoredUserRepository } from "@infra/db/mongodb/repositories/ProctoredUserRepository"



export const makeDeleteProctoredUserById = (): DeleteProctoredUserByIdInterface => {
    const proctoredUserRepository = new ProctoredUserRepository()
    return new DeleteProctoredUserById(proctoredUserRepository, proctoredUserRepository)
}