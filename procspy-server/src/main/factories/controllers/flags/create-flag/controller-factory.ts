import { BaseController } from "@infra/http/controllers/BaseController"
import { CreateFlagController } from "@infra/http/controllers/flags/CreateFlagController"
import { makeCreateFlagValidation } from "./validation-factory"
import { makeCreateFlag } from "@main/factories/use-cases/flags/create-flag-factory"


export const makeCreateFlagController = (): BaseController => {
    const validation = makeCreateFlagValidation()
    const useCase = makeCreateFlag()

    return new CreateFlagController(validation, useCase)
}