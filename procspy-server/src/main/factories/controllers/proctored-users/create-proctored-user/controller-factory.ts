import { CreateProctoredUserController } from "@infra/http/controllers/proctored-users/CreateProctoredUserController";
import { BaseController } from "../../../../../infra/http/controllers/BaseController";
import { makeCreateProctoredUserValidation } from "./validation-factory";
import { makeCreateProctoredUser } from "@main/factories/use-cases/procotored-users/create-proctored-user-factory";

export const makeCreateProctoredUserController = (): BaseController => {
    const validation = makeCreateProctoredUserValidation()
    const useCase = makeCreateProctoredUser()

    return new CreateProctoredUserController(validation, useCase)
}