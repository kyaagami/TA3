import { UpdateUserInterface } from "@application/interfaces/use-cases/users/UpdateUserInterface";
import { UnauthorizedError } from "../../../../application/errors/UnauthorizedError";
import { ok, unauthorized } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";
import { User } from "@domain/entities/User";
import { UserNotExistError } from "@application/errors/UserNotExistError";
import { EmailInUseError } from "@application/errors/EmailInUseError";



export class UpdateUserController extends BaseController {

    constructor(
        private readonly updateUserValidation: Validation,
        private readonly updateUser: UpdateUserInterface
    ) {
        super(updateUserValidation)
    }

    async execute(httpRequest: UpdateUserController.Request): Promise<UpdateUserController.Response> {
        const { id, email, name, password, username, } = httpRequest.body!
        const userOrError = await this.updateUser.execute({
            id, email, name, password, username,
            active: false
        })

        
        if (userOrError instanceof UnauthorizedError) {
            return unauthorized(userOrError)
        } else {
            return ok(userOrError)
        }

    }

}

export namespace UpdateUserController {
    export type Request = HttpRequest<UpdateUserInterface.Request>
    export type Response = HttpResponse<Omit <User, 'password'> | UserNotExistError | EmailInUseError>
}