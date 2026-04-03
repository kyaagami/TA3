import { CreateFlagInterface } from "@application/interfaces/use-cases/flags/CreateFlagInterface"
import { CreateFlag } from "@application/use-cases/flags/CreateFlag"
import { FlagRepository } from "@infra/db/mongodb/repositories/FlagRepository"


export const makeCreateFlag = (): CreateFlagInterface => {
    const flagRepository = new FlagRepository()
    const getFlagByFlagKeyRepository = new FlagRepository()
    return new CreateFlag(flagRepository, getFlagByFlagKeyRepository)
}