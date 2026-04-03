import { expressRouteAdapter } from "@main/adapters/express-route-adapter"
import { makeGetSessionResultByTokenController } from "@main/factories/controllers/logs/session-results/get-session-result-by-token/controller-factory"
import { authMiddleware } from "@main/middlewares/auth-middleware"
import { Router } from "express"



export default(router: Router): void => {
    

    router.get('/session-result-token/:token', authMiddleware, expressRouteAdapter(makeGetSessionResultByTokenController()))

}