import {Router} from 'express'
const routes = Router()

import PlanController from '../controller/PlanController.js'
// import { verifyPermissions } from '../../middlewares/v1/verifyUser.js'

import multer from 'multer'
import multerConfig from "../config/multer.js"
const upload = multer(multerConfig)

routes.post("/", PlanController.create)
routes.get("/", PlanController.get)
routes.get("/:id", PlanController.find)
routes.put("/:id", PlanController.update)
routes.delete("/:id", PlanController.destroy)

// routes.post("/", verifyPermissions, PlanController.create)
// routes.get("/", PlanController.get)
// routes.get("/:id", verifyPermissions, PlanController.find)
// routes.put("/:id", PlanController.update)
// routes.delete("/:id", verifyPermissions, PlanController.destroy)

export default routes;