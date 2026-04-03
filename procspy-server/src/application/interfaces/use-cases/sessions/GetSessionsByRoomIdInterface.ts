import { Room } from "@domain/entities/Room";
import { UseCase } from "../UseCase";
import { ProctoredUser } from "@domain/entities/ProctoredUser";
import { Session } from "@domain/entities/Session";
import { SessionDetail } from "@domain/entities/SessionDetail";
import { SessionResult } from "@domain/entities/SessionResult";

export type EnrichedSession = Session & {
  proctoredUser: ProctoredUser | null;
  session_details: SessionDetail | null;
  session_result: SessionResult | null;
};


export interface GetSessionsByRoomIdInterface extends UseCase<GetSessionsByRoomIdInterface.Request, GetSessionsByRoomIdInterface.Response>{

    execute(params: GetSessionsByRoomIdInterface.Request): Promise<GetSessionsByRoomIdInterface.Response>
    
}

export namespace GetSessionsByRoomIdInterface{
  export type Request = { roomId: string, page?: number, paginationLimit?: number };
  export type Response = { data: Array<EnrichedSession>, page: number, total: number, totalPages: number };
}