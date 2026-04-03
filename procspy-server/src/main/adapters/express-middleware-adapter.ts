import { NextFunction, Request, Response } from "express";
import { BaseMiddleware } from "../../infra/http/middlewares/BaseMiddleware";
import { HttpRequest } from "../../infra/http/interfaces/HttpRequest";

export const expressMiddlewareAdapter = (
    middleware: BaseMiddleware
) => async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers
    }

    console.log("webRtc Request", httpRequest)

    const httpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
        Object.assign(req, httpRequest.body)
        next()
    } else {
        res.status(httpResponse.statusCode).json({
            error: httpResponse.body?.message
        })
    }
}