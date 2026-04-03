import express, { Router } from "express";
import { expressRouteAdapter } from "../adapters/express-route-adapter";
import { authMiddleware } from "@main/middlewares/auth-middleware";
import { makeCreateLogController } from "@main/factories/controllers/logs/create-log/controller-factory";
import { webrtcMiddleware } from "@main/middlewares/webrtc-middleware";
import { makeCreateLogByTokenController } from "@main/factories/controllers/logs/create-log-by-token/controller-factory";
import { makeGetProctoredUserDetailLogByTokenController } from "@main/factories/controllers/etc/get-proctored-user-detail-log-by-token/controller-factory";
import path from "path";
import { upload } from "@main/middlewares/multer";
import { makeStoreFileController } from "@main/factories/controllers/storage/store-file/controller-factory";


export default(router: Router): void => {
    router.post('/storage', webrtcMiddleware,  upload.single('file'), expressRouteAdapter(makeStoreFileController()))
}