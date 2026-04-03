import { StoreFileInterface } from "@application/interfaces/use-cases/storage/StoreFileInterface";
import { badRequest, ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { RoomAlreadyExistError } from "@application/errors/RoomAlreadyExistError";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";



export class StoreFileController extends BaseController {

    constructor(
        private readonly storeFile: StoreFileInterface
    ) {
        super()
    }

    async execute(httpRequest: StoreFileController.Request): Promise<StoreFileController.Response> {
        const file = httpRequest.file!

        const path = await this.storeFile.execute(file)

        if(path instanceof Error){
            return badRequest(Error(path.toString()))
        }
        return ok({path})

    }

}

export namespace StoreFileController {
    export type Request = HttpRequest<StoreFileInterface.Request>
    export type Response = HttpResponse<{ path: string } | SessionNotExistError>
}