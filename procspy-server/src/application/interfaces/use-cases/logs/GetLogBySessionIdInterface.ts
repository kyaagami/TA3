import { Log } from "@domain/entities/Log";
import { UseCase } from "../UseCase";
import { Session } from "inspector/promises";
import { ProctoredUser } from "@domain/entities/ProctoredUser";

export interface GetLogsBySessionIdInterface extends UseCase<GetLogsBySessionIdInterface.Request, GetLogsBySessionIdInterface.Response> {

    execute(params: GetLogsBySessionIdInterface.Request): Promise<GetLogsBySessionIdInterface.Response>

}

export namespace GetLogsBySessionIdInterface {
    export type Request = string;
    export type Response = { data: Log[] };
}