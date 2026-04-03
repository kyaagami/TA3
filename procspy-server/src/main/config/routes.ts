import authenticationRoutes from "@main/routes/authentication-routes"
import flagsRoutes from "@main/routes/flags-routes"
import globalSettingsRoutes from "@main/routes/global-settings-routes"
import logsRoutes from "@main/routes/logs-routes"
import proctoredUsersRoutes from "@main/routes/proctored-users-routes"
import roomsRoutes from "@main/routes/rooms-routes"
import sessionDetailsRoutes from "@main/routes/session-details-routes"
import sessionResultsRoutes from "@main/routes/session-results-routes"
import sessionsRoutes from "@main/routes/sessions-routes"
import storageRoutes from "@main/routes/storage-routes"
import userRoutes from "@main/routes/user-routes"
import express, { Router, Express, response } from "express"


export default (app: Express): void => {
    const router = Router()
    // routes goes here
    app.use('/api',router)
    // app.use()
    userRoutes(router)
    authenticationRoutes(router)
    roomsRoutes(router)
    sessionsRoutes(router)
    logsRoutes(router)
    flagsRoutes(router)
    proctoredUsersRoutes(router)
    globalSettingsRoutes(router)
    storageRoutes(router)
    sessionDetailsRoutes(router)
    sessionResultsRoutes(router)
}