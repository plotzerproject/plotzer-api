import {Router} from 'express'
const routes = Router()

import TeamController from '../controller/TeamController.js'

import multer from 'multer'
import multerConfig from '../config/multer.js'
// import { verifyPermissions } from '../../middlewares/v1/verifyUser.js'
const upload = multer(multerConfig)

routes.post("/", TeamController.create)
routes.get("/", TeamController.get)
routes.get("/:id", TeamController.find)
routes.put("/:id", TeamController.update)
routes.delete("/:id", TeamController.destroy)

// routes.get("/members/:id_team", TeamController.getMembers)
// routes.get("/members/:id_team/:id_member", TeamController.getMember) //get a specific member

// routes.post("/members/:id_team/invite", TeamController.addMember)
// routes.post("/members/:id_team/remove", TeamController.removeMember)
// routes.post("/members/:id_team/join", TeamController.joinTeam)
// routes.post("/members/:id_team/leave", TeamController.leaveTeam)

export default routes;