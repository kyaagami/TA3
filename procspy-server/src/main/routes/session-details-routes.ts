import { Router } from "express";
import { expressRouteAdapter } from "../adapters/express-route-adapter";
import { webrtcMiddleware } from "@main/middlewares/webrtc-middleware";
import { makeCreateOrUpdateSessionDetailController } from "@main/factories/controllers/session-details/create-or-update-session-detail/controller-factory";


export default(router: Router): void => {
    router.post('/session-detail', webrtcMiddleware, expressRouteAdapter(makeCreateOrUpdateSessionDetailController()))
}