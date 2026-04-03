import { Flag, FlagProps } from "@domain/entities/Flag"


export interface GetFlagsRepository{
    getFlags(params: GetFlagsRepository.Request): Promise<GetFlagsRepository.Response>
}

export namespace GetFlagsRepository {
    export type Request = {page: number, paginationLimit: number}
    export type Response = { data: Flag[], page: number, total: number, totalPages: number }
}