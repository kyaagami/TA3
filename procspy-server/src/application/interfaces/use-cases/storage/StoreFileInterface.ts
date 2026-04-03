import { Room } from "@domain/entities/Room";
import { UseCase } from "../UseCase";


export interface StoreFileInterface extends UseCase<StoreFileInterface.Request, StoreFileInterface.Response>{

    execute(file: StoreFileInterface.Request): Promise<StoreFileInterface.Response>
    
}

export namespace StoreFileInterface{
  export type Request = Express.Multer.File
  export type Response = string | Error;
}