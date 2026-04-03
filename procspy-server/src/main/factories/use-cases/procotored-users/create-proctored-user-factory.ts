import { CreateProctoredUserInterface } from "@application/interfaces/use-cases/proctored-users/CreateProctoredUserInterface"
import { CreateProctoredUser } from "@application/use-cases/proctored-users/CreateProctoredUser"
import { ProctoredUserRepository } from "@infra/db/mongodb/repositories/ProctoredUserRepository"



export const makeCreateProctoredUser = (): CreateProctoredUserInterface => {
    const proctoredUserRepository = new ProctoredUserRepository()
    const getProctoredUsersRepository = new ProctoredUserRepository()
    return new CreateProctoredUser(proctoredUserRepository, getProctoredUsersRepository)
}