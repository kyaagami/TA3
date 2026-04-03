import { UseCase } from "../UseCase";
import { Flag } from "@domain/entities/Flag";

export interface GetFlagsInterface extends UseCase<GetFlagsInterface.Request, GetFlagsInterface.Response> {

    execute(params: GetFlagsInterface.Request): Promise<GetFlagsInterface.Response>

}

export namespace GetFlagsInterface {
    export type Request = { page?: number };
    export type Response = { data: Flag[], page: number, total: number, totalPages: number };
}