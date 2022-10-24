import {Router} from 'express'
const routes = Router()

import KanbanController from '../controller/KanbanController.js'

import multer from 'multer'
import multerConfig from "../config/multer.js"
import { verifyPermissions } from '../middlewares/VerifyUser.js'
const upload = multer(multerConfig)

routes.post("/", KanbanController.create) //ok
routes.get("/get", verifyPermissions, KanbanController.get) //ok
routes.get("/get/:id", KanbanController.find) //ok
routes.put("/put/:id", KanbanController.update) //ok
routes.put("/put/:id/:idTopic", KanbanController.updateTopic) //ok
routes.delete("/delete/:id", KanbanController.destroy) //nao testei
routes.delete("/delete/:id/:idTopic", KanbanController.deleteTopic) //ok

routes.get("/@me", KanbanController.me, KanbanController.getUserBoards) //ok

export default routes;