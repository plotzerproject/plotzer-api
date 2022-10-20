import { Router } from "express";
const routes = Router();

import AssignmentController from "../controller/AssignmentController.js";
// import { verifyAuthentication } from '../middlewares/AuthMiddleware.js'

import multer from "multer";
import multerConfig from "../config/multer.js";
import {
  teamPermissions,
  verifyPermissions,
  verifyUserHasPermissions,
  verifyUserOnTeam,
} from "../middlewares/VerifyUser.js";
import UserAssignmentRepository from "../repositories/UserAssignmentRepository.js";
const upload = multer(multerConfig);

routes.post(
  "/",
  (req, res, next) => {
    res.locals.permission = teamPermissions.moderator;
    res.locals.permissionApp = false;
    next();
  },
  verifyUserHasPermissions,
  AssignmentController.create
);
routes.get("/", verifyPermissions, AssignmentController.get);
routes.get("/:id", verifyUserOnTeam, AssignmentController.find);
routes.put(
  "/:id",
  (req, res, next) => {
    res.locals.permission = teamPermissions.moderator;
    res.locals.permissionApp = false;
    next();
  },
  verifyUserHasPermissions,
  AssignmentController.update
);
routes.delete(
  "/:id",
  (req, res, next) => {
    res.locals.permission = teamPermissions.moderator;
    res.locals.permissionApp = false;
    next();
  },
  verifyUserHasPermissions,
  AssignmentController.destroy
);

routes.get("/teste/a", async (req, res)=>{
    const a = await UserAssignmentRepository.get()
    res.send(a)
});
routes.get("/@me/my-assignments", AssignmentController.me, AssignmentController.getUserAssignments);
routes.post(
  "/@me/complete-assignment",
  AssignmentController.me,
  AssignmentController.completeAssignment
);

export default routes;
