import { Session, SessionStatus } from "@domain/entities/Session";
import { UseCase } from "../UseCase";
import { SessionAlreadyExistError } from "@application/errors/SessionAlreadyExistError";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { SessionLockedError } from "@application/errors/SesionLockedError";
import { SessionStatusError } from "@application/errors/SessionStatusError";


export interface UpdateSessionStatusInterface extends UseCase<UpdateSessionStatusInterface.Request, UpdateSessionStatusInterface.Response> {

    execute(credentials: UpdateSessionStatusInterface.Request): Promise<UpdateSessionStatusInterface.Response>

}

export namespace UpdateSessionStatusInterface {
    export type Request = {token:string, status:SessionStatus}
    export type Response = Session | SessionNotExistError | SessionStatusError | SessionLockedError
}