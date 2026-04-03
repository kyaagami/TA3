import { CreateOrUpdateSessionDetailController } from "@infra/http/controllers/session-details/CreateOrUpdateSessionDetailController";
import { BaseController } from "../../../../../infra/http/controllers/BaseController";
import { makeCreateOrUpdateSessionDetailValidation } from "./validation-factory";
import { makeCreateOrUpdateSessionDetail } from "@main/factories/use-cases/session-details/create-or-update-session-detail-factory";

export const makeCreateOrUpdateSessionDetailController = (): BaseController => {
    const validation = makeCreateOrUpdateSessionDetailValidation()
    const useCase = makeCreateOrUpdateSessionDetail()

    return new CreateOrUpdateSessionDetailController(validation, useCase)
}