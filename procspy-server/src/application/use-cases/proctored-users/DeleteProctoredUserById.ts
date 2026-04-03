import { ProctoredUserNotExistError } from "@application/errors/ProctoredUserNotExistError"
import { GetProctoredUserByIdRepository } from "@application/interfaces/repositories/proctored-users/GetProctoredUserByIdRepository"
import { UpdateProctoredUserRepository } from "@application/interfaces/repositories/proctored-users/UpdateProctoredUserRepository"
import { DeleteProctoredUserByIdInterface } from "@application/interfaces/use-cases/proctored-users/DeleteProctoredUserByIdInterface"


export class DeleteProctoredUserById implements DeleteProctoredUserByIdInterface {
    constructor(
        private readonly getProctoredUserByIdRepository: GetProctoredUserByIdRepository,
        private readonly updateProctoredUserRepository: UpdateProctoredUserRepository,
    ) { }

    async execute(id: DeleteProctoredUserByIdInterface.Request): Promise<DeleteProctoredUserByIdInterface.Response> {
        

        const proctoredUser = await this.getProctoredUserByIdRepository.getProctoredUserById(id)
        if (!proctoredUser) {
            return new ProctoredUserNotExistError()
        }

        const deletedProctoredUser = await this.updateProctoredUserRepository.updateProctoredUser({
            id, deletedAt: new Date().toISOString(),
            name: proctoredUser.name ,
            email: proctoredUser.email,
            identifier: proctoredUser.identifier
        })

        if (!deletedProctoredUser) {
            return new ProctoredUserNotExistError()
        }
        
        if(deletedProctoredUser){
            return true
        }

        return false

    }
}