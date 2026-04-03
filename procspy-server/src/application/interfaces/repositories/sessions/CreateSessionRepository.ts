import { SessionProps } from "@domain/entities/Session"


export interface CreateSessionRepository{
    createSession(sessionData: CreateSessionRepository.Request): Promise<CreateSessionRepository.Response>
}

export namespace CreateSessionRepository {
    export type Request = Omit<SessionProps, 'id' | 'startTime' | 'endTime' | 'createdAt' >
    export type Response = string
}