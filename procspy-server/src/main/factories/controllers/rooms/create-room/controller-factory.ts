import { CreateRoomController } from "@infra/http/controllers/rooms/CreateRoomController";
import { BaseController } from "../../../../../infra/http/controllers/BaseController";
import { makeCreateRoom } from "@main/factories/use-cases/rooms/create-room-factory";
import { makeCreateRoomValidation } from "./validation-factory";

export const makeCreateRoomController = (): BaseController => {
    const validation = makeCreateRoomValidation()
    const useCase = makeCreateRoom()

    return new CreateRoomController(validation, useCase)
}