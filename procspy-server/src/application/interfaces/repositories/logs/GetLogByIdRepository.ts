import { Flag } from "@domain/entities/Flag"
import { Log } from "@domain/entities/Log"


export interface GetLogByIdRepository{
    getLogById(id: GetLogByIdRepository.Request): Promise<GetLogByIdRepository.Response>
}

export namespace GetLogByIdRepository {
    export type Request = string
    export type Response = Log | null
}