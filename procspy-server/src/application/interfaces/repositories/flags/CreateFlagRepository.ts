import { FlagProps } from "@domain/entities/Flag"


export interface CreateFlagRepository{
    createFlag(flagData: CreateFlagRepository.Request): Promise<CreateFlagRepository.Response>
}

export namespace CreateFlagRepository {
    export type Request = Omit<FlagProps, 'id' >
    export type Response = string
}