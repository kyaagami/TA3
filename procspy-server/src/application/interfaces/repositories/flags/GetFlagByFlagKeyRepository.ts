import { Flag } from "@domain/entities/Flag"


export interface GetFlagByFlagKeyRepository{
    getFlagByFlagKey(flagKey: GetFlagByFlagKeyRepository.Request): Promise<GetFlagByFlagKeyRepository.Response>
}

export namespace GetFlagByFlagKeyRepository {
    export type Request = string
    export type Response = Flag | null
}