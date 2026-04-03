import { GetSessionsByRoomIdController } from "@infra/http/controllers/sessions/GetSessionsByRoomIdController";
import { BaseController } from "../../../../../infra/http/controllers/BaseController";
import { makeGetSessionsByRoomIdValidation } from "./validation-factory";
import { makeGetSessionsByRoomId } from "@main/factories/use-cases/sessions/get-sessions-by-room-id-factory";

export const makeGetSessionsByRoomIdController = (): BaseController => {
    const validation = makeGetSessionsByRoomIdValidation()
    const useCase = makeGetSessionsByRoomId()

    return new GetSessionsByRoomIdController(validation, useCase)
}