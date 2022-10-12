import {Router} from 'express'
const routes = Router()

import PlanController from '../controller/PlanController.js'
import { verifyAuthentication } from '../middlewares/AuthMiddleware.js'

import multer from 'multer'
import multerConfig from "../config/multer.js"
const upload = multer(multerConfig)

routes.post("/", verifyAuthentication, PlanController.create)
routes.get("/", PlanController.get)
routes.get("/:id", PlanController.find)
routes.put("/:id", verifyAuthentication, PlanController.update)
routes.delete("/:id", verifyAuthentication, PlanController.destroy)

export default routes;