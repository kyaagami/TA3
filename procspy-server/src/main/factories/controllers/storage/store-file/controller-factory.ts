import { BaseController } from "@infra/http/controllers/BaseController"
import { StoreFileController } from "@infra/http/controllers/storage/StoreFileController"
import { makeStoreFile } from "@main/factories/use-cases/storage/file-store-factory"


export const makeStoreFileController = (): BaseController => {
    const useCase = makeStoreFile()

    return new StoreFileController(useCase)
}