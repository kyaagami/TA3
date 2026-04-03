import express, { Express } from 'express'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import path from 'path'
import { upload } from '@main/middlewares/multer'
import { badRequest, ok } from '@infra/http/helpers/http'
import { HttpRequest } from '@infra/http/interfaces/HttpRequest'
import { HttpResponse } from '@infra/http/interfaces/HttpResponse'

export default (): Express => {
    const app = express()
    app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')))
    setupMiddlewares(app)
    setupRoutes(app)
    return app
}