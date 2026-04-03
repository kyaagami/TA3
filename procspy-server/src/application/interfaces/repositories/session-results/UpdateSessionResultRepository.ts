import { SessionResult, SessionResultProps } from "@domain/entities/SessionResult"


export interface UpdateSessionResultRepository{
    updateSessionResult(data: UpdateSessionResultRepository.Request): Promise<UpdateSessionResultRepository.Response>
}

export namespace UpdateSessionResultRepository {
    export type Request = Omit<SessionResultProps, 'sessionId' | 'updatedAt' >
    export type Response = SessionResult | null
}