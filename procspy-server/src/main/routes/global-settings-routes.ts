import { Router } from "express";
import { expressRouteAdapter } from "../adapters/express-route-adapter";
import { authMiddleware } from "@main/middlewares/auth-middleware";
import { makeCreateGlobalSettingController } from "@main/factories/controllers/global-settings/create-global-setting/controller-factory";
import { makeGetGlobalSettingsController } from "@main/factories/controllers/global-settings/get-global-settings/controller-factory";
import { makeUpdateGlobalSettingController } from "@main/factories/controllers/global-settings/update-global-setting/controller-factory";


export default(router: Router): void => {
    router.post('/global-setting', authMiddleware, expressRouteAdapter(makeCreateGlobalSettingController()))
    router.put('/global-setting', authMiddleware, expressRouteAdapter(makeUpdateGlobalSettingController()))
    router.get('/global-settings', authMiddleware, expressRouteAdapter(makeGetGlobalSettingsController()))
}