import { FlagAlreadyExistError } from "@application/errors/FlagAlreadyExistError"
import { FlagNotExistError } from "@application/errors/FlagNotExistError"
import { SessionNotExistError } from "@application/errors/SessionNotExistError"
import { CreateFlagRepository } from "@application/interfaces/repositories/flags/CreateFlagRepository"
import { GetFlagByFlagKeyRepository } from "@application/interfaces/repositories/flags/GetFlagByFlagKeyRepository"
import { GetSessionByIdRepository } from "@application/interfaces/repositories/sessions/GetSessionByIdRepository"
import { CreateFlagInterface } from "@application/interfaces/use-cases/flags/CreateFlagInterface"



export class CreateFlag implements CreateFlagInterface {
    constructor(
        private readonly createFlagRepository: CreateFlagRepository,
        private readonly getFlagByFlagKeyRepository: GetFlagByFlagKeyRepository,
    ) { }

    async execute(body: CreateFlagInterface.Request): Promise<CreateFlagInterface.Response> {
        const { flagKey, label, severity } = body
        
        const isFlagExist = await this.getFlagByFlagKeyRepository.getFlagByFlagKey(flagKey)
        
        if(isFlagExist){
            return new FlagAlreadyExistError()
        }

        const newFlag = await this.createFlagRepository.createFlag({
            flagKey: flagKey.toUpperCase(),
            label,
            severity
        })
        
        return newFlag
    }
}