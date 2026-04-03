import { Router } from "express";
import { expressRouteAdapter } from "../adapters/express-route-adapter";
import { authMiddleware } from "@main/middlewares/auth-middleware";
import { makeCreateLogController } from "@main/factories/controllers/logs/create-log/controller-factory";
import { webrtcMiddleware } from "@main/middlewares/webrtc-middleware";
import { makeCreateLogByTokenController } from "@main/factories/controllers/logs/create-log-by-token/controller-factory";
import { makeGetProctoredUserDetailLogByTokenController } from "@main/factories/controllers/etc/get-proctored-user-detail-log-by-token/controller-factory";
import { makeGetLogsByRoomIdController } from "@main/factories/controllers/logs/get-logs-by-room-id/controller-factory";
import { makeGetLogsByTokenController } from "@main/factories/controllers/logs/get-logs-by-token/controller-factory";
import { makeUpdateLogByIdController } from "@main/factories/controllers/logs/update-log-by-id/controller-factory";


export default(router: Router): void => {
    router.post('/log', authMiddleware, expressRouteAdapter(makeCreateLogController()))
    router.post('/save-log', webrtcMiddleware, expressRouteAdapter(makeCreateLogByTokenController()))

    router.get('/logs-in-room/:roomId', authMiddleware, expressRouteAdapter(makeGetLogsByRoomIdController()))
    router.get('/logs-proctored-user/:token', authMiddleware, expressRouteAdapter(makeGetLogsByTokenController()))

    router.post('/update-log-type', authMiddleware, expressRouteAdapter(makeUpdateLogByIdController()))
}