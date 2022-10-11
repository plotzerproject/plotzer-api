import {Router} from 'express'
const routes = Router()

import AuthController from '../controller/AuthController.js'

routes.post("/create", AuthController.create)
routes.post("/login", AuthController.authenticate)
routes.post("/refresh-token", AuthController.refresh)


export default routes;