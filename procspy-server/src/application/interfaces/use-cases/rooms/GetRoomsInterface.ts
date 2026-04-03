import { Room } from "@domain/entities/Room";
import { UseCase } from "../UseCase";


export interface GetRoomsInterface extends UseCase<GetRoomsInterface.Request, GetRoomsInterface.Response>{

    execute(params: GetRoomsInterface.Request): Promise<GetRoomsInterface.Response>
    
}

export namespace GetRoomsInterface{
    export type Request = { page?: number, paginationLimit?: number };
  export type Response = { data: Room[], page: number, total: number, totalPages: number };
}