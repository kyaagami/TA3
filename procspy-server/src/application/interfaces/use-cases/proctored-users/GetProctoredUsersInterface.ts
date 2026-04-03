import { UseCase } from "../UseCase";
import { ProctoredUser } from "@domain/entities/ProctoredUser";


export interface GetProctoredUsersInterface extends UseCase<GetProctoredUsersInterface.Request, GetProctoredUsersInterface.Response> {

    execute(params: GetProctoredUsersInterface.Request): Promise<GetProctoredUsersInterface.Response>

}

export namespace GetProctoredUsersInterface {
    export type Request = { page?: number, paginationLimit?: number };
    export type Response = { data: ProctoredUser[], page: number, total: number, totalPages: number };
}