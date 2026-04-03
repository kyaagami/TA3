import { Router } from "express";
import { expressRouteAdapter } from "../adapters/express-route-adapter";
import { authMiddleware } from "@main/middlewares/auth-middleware";
import { makeCreateSessionController } from "@main/factories/controllers/sessions/create-session/controller-factory";
import { makeGetSessionsByProctoredUserIdController } from "@main/factories/controllers/sessions/get-sessions-by-proctored-user-id/controller-factory";
import { makeUpdateSessionStatusController } from "@main/factories/controllers/sessions/update-session-status/controller-factory";
import { webrtcMiddleware } from "@main/middlewares/webrtc-middleware";
import { makeUpdateSessionController } from "@main/factories/controllers/sessions/update-session/controller-factory";
import { makeGetSessionsByRoomIdController } from "@main/factories/controllers/sessions/get-sessions-by-room-id/controller-factory";


export default(router: Router): void => {
    router.post('/session', authMiddleware, expressRouteAdapter(makeCreateSessionController()))
    router.get('/sessions/:proctoredUserId', authMiddleware, expressRouteAdapter(makeGetSessionsByProctoredUserIdController()))
    router.get('/session/update-status/:token/:status', webrtcMiddleware, expressRouteAdapter(makeUpdateSessionStatusController()))
    router.get('/session/update-status-proctor/:token/:status', authMiddleware, expressRouteAdapter(makeUpdateSessionStatusController()))
    router.patch('/session', authMiddleware, expressRouteAdapter(makeUpdateSessionController()))

    router.get('/sessions-in-room/:roomId', authMiddleware, expressRouteAdapter(makeGetSessionsByRoomIdController()))

}