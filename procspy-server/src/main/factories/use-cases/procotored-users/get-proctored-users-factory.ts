import { GetProctoredUsersInterface } from "@application/interfaces/use-cases/proctored-users/GetProctoredUsersInterface"
import { GetProctoredUsers } from "@application/use-cases/proctored-users/GetProctoredUsers"
import { ProctoredUserRepository } from "@infra/db/mongodb/repositories/ProctoredUserRepository"



export const makeGetProctoredUsers = (): GetProctoredUsersInterface => {
    const proctoredUserRepository = new ProctoredUserRepository()
    return new GetProctoredUsers(proctoredUserRepository)
}