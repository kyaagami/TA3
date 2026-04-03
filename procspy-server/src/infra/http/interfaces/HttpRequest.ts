import { Multer } from "multer"

export type HttpRequest<TBody =any, TParams=any, TQuery=any, THeaders = any, TFile=Express.Multer.File> = {
    body?: TBody
    params?: TParams
    query?: TQuery
    headers?: THeaders
    userId?: string
    file?: TFile
}