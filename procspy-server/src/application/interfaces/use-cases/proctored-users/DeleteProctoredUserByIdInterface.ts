import { ProctoredUser } from "@domain/entities/ProctoredUser";
import { UseCase } from "../UseCase";
import { ProctoredUserNotExistError } from "@application/errors/ProctoredUserNotExistError";


export interface DeleteProctoredUserByIdInterface extends UseCase<DeleteProctoredUserByIdInterface.Request, DeleteProctoredUserByIdInterface.Response> {

    execute(id: DeleteProctoredUserByIdInterface.Request): Promise<DeleteProctoredUserByIdInterface.Response>

}

export namespace DeleteProctoredUserByIdInterface {
    export type Request = string
    export type Response = boolean | ProctoredUserNotExistError
}