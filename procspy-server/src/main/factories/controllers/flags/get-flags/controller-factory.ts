import { BaseController } from "@infra/http/controllers/BaseController"
import { GetFlagsController } from "@infra/http/controllers/flags/GetFlagsController"
import { makeGetFlagsValidation } from "./validation-factory"
import { makeGetFlags } from "@main/factories/use-cases/flags/get-flags-factory"


export const makeGetFlagsController = (): BaseController => {
    const validation = makeGetFlagsValidation()
    const useCase = makeGetFlags()

    return new GetFlagsController(validation, useCase)
}