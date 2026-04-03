import { EmailInUseError } from "../../../../application/errors/EmailInUseError";
import { UnauthorizedError } from "../../../../application/errors/UnauthorizedError";
import { SignInInterface } from "../../../../application/interfaces/use-cases/authentication/SignInInterface";
import { SignUpInterface } from "../../../../application/interfaces/use-cases/authentication/SignUpInterface";
import { User } from "../../../../domain/entities/User";
import { forbidden, ok } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { Validation } from "../../interfaces/Validation";
import { BaseController } from "../BaseController";



export class SignUpController extends BaseController{
    constructor(
        private readonly signUpValidation: Validation,
        private readonly signUp: SignUpInterface,
        
    ){
        super(signUpValidation)
    }

    async execute(httpRequest: SignUpController.Request): Promise<SignUpController.Response> {
        const {name, username, email, password } = httpRequest.body!

        const idOrError = await this.signUp.execute({name, username, email, password})
        if(idOrError instanceof EmailInUseError){
            return forbidden(idOrError)
        }


        return ok({
           id: idOrError
        })
        

    }
}


export namespace SignUpController {
    export type Request = HttpRequest<SignUpInterface.Request>
    export type Response = HttpResponse<{id:string} | EmailInUseError>

}