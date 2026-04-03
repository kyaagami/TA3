import { StoreFileInterface } from "@application/interfaces/use-cases/storage/StoreFileInterface"
import { StoreFile } from "@application/use-cases/storage/StoreFile"
import { SessionRepository } from "@infra/db/mongodb/repositories/SessionRepository"


export const makeStoreFile = (): StoreFileInterface => {
    return new StoreFile()
}