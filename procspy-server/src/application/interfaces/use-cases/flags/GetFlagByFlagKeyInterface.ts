import { Flag } from "@domain/entities/Flag"
import { UseCase } from "../UseCase"


export interface GetFlagByFlagKeyInterface extends UseCase<GetFlagByFlagKeyInterface.Request, GetFlagByFlagKeyInterface.Response>{

    execute(flagKey: GetFlagByFlagKeyInterface.Request): Promise<GetFlagByFlagKeyInterface.Response>
    
}

export namespace GetFlagByFlagKeyInterface{
    export type Request = string
    export type Response = Flag | Error
}