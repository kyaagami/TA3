import { UseCase } from "../UseCase";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { SessionResult } from "@domain/entities/SessionResult";


export interface GetSessionResultByTokenInterface extends UseCase<GetSessionResultByTokenInterface.Request, GetSessionResultByTokenInterface.Response> {

    execute(credentials: GetSessionResultByTokenInterface.Request): Promise<GetSessionResultByTokenInterface.Response>

}

export namespace GetSessionResultByTokenInterface {
    export type Request = string;
    export type Response = SessionResult | SessionNotExistError;
}