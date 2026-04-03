import { Session } from "@domain/entities/Session";
import { UseCase } from "../UseCase";
import { SessionAlreadyExistError } from "@application/errors/SessionAlreadyExistError";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { SessionLockedError } from "@application/errors/SesionLockedError";


export interface UpdateSessionInterface extends UseCase<UpdateSessionInterface.Request, UpdateSessionInterface.Response> {

    execute(credentials: UpdateSessionInterface.Request): Promise<UpdateSessionInterface.Response>

}

export namespace UpdateSessionInterface {
    export type Request = Omit<Session, 'createdAt'>
    export type Response = Session | SessionNotExistError | SessionLockedError
}