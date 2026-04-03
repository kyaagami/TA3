import { Session } from "@domain/entities/Session";
import { UseCase } from "../UseCase";
import { SessionAlreadyExistError } from "@application/errors/SessionAlreadyExistError";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";


export interface GetSessionByIdInterface extends UseCase<GetSessionByIdInterface.Request, GetSessionByIdInterface.Response> {

    execute(credentials: GetSessionByIdInterface.Request): Promise<GetSessionByIdInterface.Response>

}

export namespace GetSessionByIdInterface {
    export type Request = string;
    export type Response = Session | SessionNotExistError;
}