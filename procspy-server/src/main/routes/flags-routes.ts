import { Router } from "express";
import { expressRouteAdapter } from "../adapters/express-route-adapter";
import { authMiddleware } from "@main/middlewares/auth-middleware";
import { makeCreateFlagController } from "@main/factories/controllers/flags/create-flag/controller-factory";
import { makeGetFlagsController } from "@main/factories/controllers/flags/get-flags/controller-factory";


export default(router: Router): void => {
    router.post('/flag', authMiddleware, expressRouteAdapter(makeCreateFlagController()))
    router.get('/flags', authMiddleware, expressRouteAdapter(makeGetFlagsController()))
}