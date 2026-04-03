import { Request, Response } from "express";
import { BaseController } from "../../infra/http/controllers/BaseController";
import { HttpRequest } from "../../infra/http/interfaces/HttpRequest";

export const expressRouteAdapter = (
    controller: BaseController
) => async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
        body: req.body,
        params: req.params,
        query: req.query, 
        headers: req.headers,
        userId: req.userId,
        file: req.file
    }
    // return res.status(200).json({
    //     error: httpRequest
    // })
    const isProd = process.env.NODE_ENV === "production";
    
    console.log(httpRequest)
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
        if(httpResponse.statusCode == 200 && httpResponse.body?.authenticationToken){
            res.cookie("access_token", httpResponse.body?.authenticationToken, {
                httpOnly: true,
                secure: true,
                sameSite: isProd ? "none" : "lax",
                domain: isProd ? ".procspy.link" : undefined
            })
        }
        res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
        res.status(httpResponse.statusCode).json({
            error: httpResponse.body?.message
        })
    }
}