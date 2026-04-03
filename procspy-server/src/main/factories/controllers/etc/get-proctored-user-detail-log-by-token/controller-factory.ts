import { BaseController } from "@infra/http/controllers/BaseController"
import { GetProctoredUserDetailLogByTokenController } from "@infra/http/controllers/etc/GetProctoredUserDetailLogByTokenController"
import { makeGetProctoredUserDetailLogByTokenValidation } from "./validation-factory"
import { makeGetProctoredUserDetailLogByToken } from "@main/factories/use-cases/etc/get-proctored-user-detail-log-by-token-factory"

export const makeGetProctoredUserDetailLogByTokenController = (): BaseController => {
    const validation = makeGetProctoredUserDetailLogByTokenValidation()
    const useCase = makeGetProctoredUserDetailLogByToken()

    return new GetProctoredUserDetailLogByTokenController(validation, useCase)
}