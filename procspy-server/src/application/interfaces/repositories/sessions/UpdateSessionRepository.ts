import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { Session } from "@domain/entities/Session"


export interface UpdateSessionRepository {
    updateSession(sessionData: UpdateSessionRepository.Request): Promise<UpdateSessionRepository.Response>
}

export namespace UpdateSessionRepository {
    export type Request = Omit<Session, 'createdAt'>
    export type Response = Session | null
}