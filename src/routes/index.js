//import libs
import {Router} from 'express'
import fs from 'fs'

//import routes
import authenticate from './authenticate.js'
import plan from './plan.js'

//create constants
const routes = Router()

import multerConfig from '../config/multer.js'
import { verifyAuthentication } from '../middlewares/AuthMiddleware.js'

//routes
routes.use("/auth", authenticate)
routes.use("/plan", plan)


routes.get("/teste", verifyAuthentication, (req, res)=>{
    res.send("teste")
})


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