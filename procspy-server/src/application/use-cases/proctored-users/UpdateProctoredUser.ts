import { ProctoredUserNotExistError } from "@application/errors/ProctoredUserNotExistError"
import { GetProctoredUserByIdRepository } from "@application/interfaces/repositories/proctored-users/GetProctoredUserByIdRepository"
import { UpdateProctoredUserRepository } from "@application/interfaces/repositories/proctored-users/UpdateProctoredUserRepository"
import { UpdateProctoredUserInterface } from "@application/interfaces/use-cases/proctored-users/UpdateProctoredUserInterface"


export class UpdateProctoredUser implements UpdateProctoredUserInterface {
    constructor(
        private readonly getProctoredUserByIdRepository: GetProctoredUserByIdRepository,
        private readonly UpdateProctoredUserRepository: UpdateProctoredUserRepository,
    ) { }

    async execute(credentials: UpdateProctoredUserInterface.Request): Promise<UpdateProctoredUserInterface.Response> {
        const { id, email,identifier,name } = credentials

        const ProctoredUser = await this.getProctoredUserByIdRepository.getProctoredUserById(id)
        if (!ProctoredUser) {
            return new ProctoredUserNotExistError()
        }

        const updatedProctoredUser = await this.UpdateProctoredUserRepository.updateProctoredUser({ id, email, name,identifier, updatedAt: (new Date()).toString() })

        if (!updatedProctoredUser) {
            return new ProctoredUserNotExistError()
        }
        return updatedProctoredUser

    }
}