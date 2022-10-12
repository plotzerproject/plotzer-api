import {Router} from 'express'
const routes = Router()
import { verifyAuthentication } from '../middlewares/AuthMiddleware.js'

import UserController from '../controller/UserController.js'

// import multer from 'multer'
// import multerConfig from '../../config/v1/multer.js'
// import { verifyAuthentication } from '../../middlewares/v1/verifyAuthentication.js'
// import { verifyPermissions, verifyUser } from '../../middlewares/v1/verifyUser.js'
// const upload = multer(multerConfig)

// routes.post("/", UserController.create)
// routes.post("/login", upload.single('photo'), UserController.login)

// routes.get("/", verifyAuthentication, verifyPermissions, UserController.get)

// routes.get("/:id", verifyAuthentication, verifyUser, UserController.find)
// routes.put("/:id", verifyAuthentication, verifyUser, UserController.update)
// routes.delete("/:id", verifyAuthentication, verifyUser, UserController.destroy)

// routes.get("/teams",  verifyUser, UserController.getMyTeams)
routes.get("/teams", verifyAuthentication, UserController.getMyTeams)

export default routes;