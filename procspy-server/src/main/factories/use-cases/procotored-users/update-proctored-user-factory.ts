import { UpdateProctoredUserInterface } from "@application/interfaces/use-cases/proctored-users/UpdateProctoredUserInterface"
import { UpdateProctoredUser } from "@application/use-cases/proctored-users/UpdateProctoredUser"
import { ProctoredUserRepository } from "@infra/db/mongodb/repositories/ProctoredUserRepository"



export const makeUpdateProctoredUser = (): UpdateProctoredUserInterface => {
    const proctoredUserRepository = new ProctoredUserRepository()
    return new UpdateProctoredUser(proctoredUserRepository, proctoredUserRepository)
}