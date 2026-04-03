import { Router } from "express";
import { expressRouteAdapter } from "../adapters/express-route-adapter";
import { authMiddleware } from "@main/middlewares/auth-middleware";
import { makeCreateProctoredUserController } from "@main/factories/controllers/proctored-users/create-proctored-user/controller-factory";
import { makeGetProctoredUsersController } from "@main/factories/controllers/proctored-users/get-proctored-users/controller-factory";
import { makeGetProctoredUserDetailLogByTokenController } from "@main/factories/controllers/etc/get-proctored-user-detail-log-by-token/controller-factory";
import { makeUpdateProctoredUserController } from "@main/factories/controllers/proctored-users/update-proctored-user/controller-factory";
import { makeDeleteProctoredUserByIdController } from "@main/factories/controllers/proctored-users/delete-proctored-user-by-id/controller-factory";


export default(router: Router): void => {
    router.post('/proctored-user', authMiddleware, expressRouteAdapter(makeCreateProctoredUserController()))
    router.put('/proctored-user', authMiddleware, expressRouteAdapter(makeUpdateProctoredUserController()))
    router.delete('/proctored-user/:id', authMiddleware, expressRouteAdapter(makeDeleteProctoredUserByIdController()))
    
    router.get('/proctored-users',authMiddleware, expressRouteAdapter(makeGetProctoredUsersController()))
    router.get('/proctored-user/:token', authMiddleware, expressRouteAdapter(makeGetProctoredUserDetailLogByTokenController()))
}