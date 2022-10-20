//import libs
import {Router} from 'express'
import fs from 'fs'

//import routes
import authenticate from './authenticate.js'
import user from './user.js'
import plan from './plan.js'
import team from './team.js'
import assignment from './assignment.js'

//import middlewares
import { verifyAuthentication } from '../middlewares/AuthMiddleware.js'

//create constants
const routes = Router()

import multerConfig from '../config/multer.js'

//routes
routes.use("/auth", authenticate)
routes.use("/user", verifyAuthentication, user)
routes.use("/plan", plan)
routes.use("/team", verifyAuthentication, team)
routes.use("/assignment", verifyAuthentication, assignment)

routes.get("/", (req, res)=>{
    res.status(200).json({data: "Welcome to Plotzer API!"})
})

routes.get("/uploads/:filename", async (req, res)=>{
    const {filename} = req.params
    const file = fs.readFileSync(`${multerConfig.directory}/${filename}`)
    res.set("Content-Type", "image/jpeg")
    res.send(file)
})

//export routes to app.js
export default routes;