import { IdentifierInUseError } from "@application/errors/IdentifierInUseError"
import { CreateProctoredUserRepository } from "@application/interfaces/repositories/proctored-users/CreateProctoredUserRepository"
import { GetProctoredUserByIdentifierRepository } from "@application/interfaces/repositories/proctored-users/GetProctoredUserByIdentifierRepository"
import { CreateProctoredUserInterface } from "@application/interfaces/use-cases/proctored-users/CreateProctoredUserInterface"


export class CreateProctoredUser implements CreateProctoredUserInterface {
    constructor(
        private readonly createProctoredUserRepository: CreateProctoredUserRepository,
        private readonly getProctoredUserByIdentifierRepository: GetProctoredUserByIdentifierRepository
    ) { }

    async execute(body: CreateProctoredUserInterface.Request): Promise<CreateProctoredUserInterface.Response> {
        const {email,identifier, name} = body

        const procotoredUserIsExist = await this.getProctoredUserByIdentifierRepository.getProctoredUserByIdentifier(identifier)

        if(procotoredUserIsExist){
            return new IdentifierInUseError()
        }

        const newProctoredUser = await this.createProctoredUserRepository.createProctoredUser({email, identifier ,name})
        
        return newProctoredUser
    }
}