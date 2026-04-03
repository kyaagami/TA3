import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { Session } from "@domain/entities/Session"


export interface UpdateSessionStatusRepository {
    updateSessionStatus(sessionData: UpdateSessionStatusRepository.Request): Promise<UpdateSessionStatusRepository.Response>
}

export namespace UpdateSessionStatusRepository {
    export type Request = Partial<Session>;
    export type Response = Session | null
}