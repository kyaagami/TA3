import { SessionProps } from "@domain/entities/Session"


export interface StoreFileRepository{
    storeFile(body: StoreFileRepository.Request): Promise<StoreFileRepository.Response>
}

export namespace StoreFileRepository {
    export type Request = {file: Express.Multer.File}
    export type Response = string
}