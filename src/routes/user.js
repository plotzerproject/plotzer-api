import {Router} from 'express'
const routes = Router()
import { verifyAuthentication } from '../middlewares/AuthMiddleware.js'

import UserController from '../controller/UserController.js'

import multer from 'multer'
import multerConfig from '../config/multer.js'
const upload = multer(multerConfig)
import { verifyPermissions, verifyUser } from '../middlewares/VerifyUser.js'

routes.get("/get", verifyPermissions, UserController.get)

routes.get("/get/:id", UserController.find)
routes.put("/put/:id", verifyPermissions, UserController.updatePermissions) //removed
// routes.delete("/delete/:id", verifyUser, UserController.destroy)
routes.get("/get/:id/teams", verifyPermissions, UserController.getUserTeams)

routes.get("/@me", UserController.me, UserController.find)
routes.put("/@me", UserController.me, upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'background', maxCount: 1 }]), UserController.update)
// routes.delete("/@me", UserController.me, UserController.destroy)
routes.get("/@me/teams", UserController.me, UserController.getUserTeams)

routes.get("/@me/requests", UserController.me, UserController.getInviteRequests)

export default routes;