import { GetFlagsInterface } from "@application/interfaces/use-cases/flags/GetFlagsInterface"
import { GetFlags } from "@application/use-cases/flags/GetFlags"
import { FlagRepository } from "@infra/db/mongodb/repositories/FlagRepository"

export const makeGetFlags = (): GetFlagsInterface => {
    const flagRepository = new FlagRepository()
    return new GetFlags(flagRepository)
}