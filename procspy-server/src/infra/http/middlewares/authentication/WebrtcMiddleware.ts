import { WebrtcAuthenticateInterface } from "@application/interfaces/use-cases/authentication/WebrtcAuthenticateInterface";
import { ForbiddenError } from "../../../../application/errors/ForbiddenError";
import { InvalidAuthTokenError } from "../../errors/InvalidAuthTokenError";
import { forbidden, ok } from "../../helpers/http";
import { HttpRequest } from "../../interfaces/HttpRequest";
import { HttpResponse } from "../../interfaces/HttpResponse";
import { BaseMiddleware } from "../BaseMiddleware";
import { AuthTokenNotProvidedError } from "@infra/http/errors/AuthTokenNotProvidedError";



export class WebrtcMiddleware extends BaseMiddleware {
    constructor(
        private readonly authenticate: WebrtcAuthenticateInterface
    ) {
        super()
    }


    async execute(httpRequest: WebrtcMiddleware.Request): Promise<WebrtcMiddleware.Response> {
        let secretHeader = httpRequest.headers?.authorization!

        if (!secretHeader) {
            return forbidden(new AuthTokenNotProvidedError())
        }
        const [, secret] = secretHeader.split(' ')

        const okOrError = await this.authenticate.execute(secret)
        if (okOrError instanceof ForbiddenError) {
            return forbidden(new InvalidAuthTokenError(secret))
        }

        return ok({})
    }
}

export namespace WebrtcMiddleware {
    export type Request = HttpRequest<{ secret: string }>
    export type Response = HttpResponse<{} | AuthTokenNotProvidedError | InvalidAuthTokenError>
}