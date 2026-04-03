import { Router } from "express";
import { expressRouteAdapter } from "../adapters/express-route-adapter";
import { makeSignInController } from "../factories/controllers/authentication/sign-in/controller-factory";
import { makeSignUpController } from "@main/factories/controllers/authentication/sign-up/controller-factory";
import { makeSignInProctoredUserController } from "@main/factories/controllers/authentication/sign-in-proctored-user/controller-factory";
import { makeUpdateUserController } from "@main/factories/controllers/users/update-user/controller-factory";
import { makeActivateUserController } from "@main/factories/controllers/authentication/activate-user/controller-factory";
import { authMiddleware } from "@main/middlewares/auth-middleware";
import { makeGetUsersController } from "@main/factories/controllers/users/get-users/controller-factory";


export default(router: Router): void => {
    router.put('/user', authMiddleware,  expressRouteAdapter(makeUpdateUserController()))
    router.get('/users/', authMiddleware,  expressRouteAdapter(makeGetUsersController()))
    router.get('/activate-user/:id', authMiddleware,  expressRouteAdapter(makeActivateUserController()))
}