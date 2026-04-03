import { serverError } from "../helpers/http";
import { HttpRequest } from "../interfaces/HttpRequest";
import { HttpResponse } from "../interfaces/HttpResponse";

export abstract class BaseMiddleware{
    abstract execute(httpRequest: HttpRequest): Promise<HttpResponse>

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try{
            return await this.execute(httpRequest)
        }catch(error){
            return serverError(error)
        }
    }
}