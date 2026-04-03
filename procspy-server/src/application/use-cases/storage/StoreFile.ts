import { EntityNotFoundError } from "@application/errors/EntityNotFoundError"
import { StoreFileInterface } from "@application/interfaces/use-cases/storage/StoreFileInterface"
import { badRequest } from "@infra/http/helpers/http";
import multer from "multer";
import path from "path";

export class StoreFile implements StoreFileInterface {
    constructor(
    ) { }

    async execute(file: StoreFileInterface.Request): Promise<StoreFileInterface.Response> {

        if (!file) {
            return new Error("!File")
        }
    
        const fileUrl = `/public/${file.filename}`;
    
        return fileUrl;
        
    }
}