import {Router} from 'express'
const routes = Router()

import PlanController from '../controller/PlanController.js'
import { verifyAuthentication } from '../middlewares/AuthMiddleware.js'

import multer from 'multer'
import multerConfig from "../config/multer.js"
import { verifyPermissions } from '../middlewares/VerifyUser.js'
const upload = multer(multerConfig)

routes.post("/", verifyAuthentication, verifyPermissions, PlanController.create)
routes.get("/", PlanController.get)
routes.get("/:id", PlanController.find)
routes.put("/:id", verifyAuthentication, verifyPermissions, PlanController.update)
routes.delete("/:id", verifyAuthentication, verifyPermissions, PlanController.destroy)

export default routes;