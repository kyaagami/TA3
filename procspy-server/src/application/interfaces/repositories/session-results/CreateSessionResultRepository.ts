import { SessionResultProps } from "@domain/entities/SessionResult"


export interface CreateSessionResultRepository{
    createSessionResult(sessionResultData: CreateSessionResultRepository.Request): Promise<CreateSessionResultRepository.Response>
}

export namespace CreateSessionResultRepository {
    export type Request = Omit<SessionResultProps, 'id' | 'createdAt' >
    export type Response = string
}