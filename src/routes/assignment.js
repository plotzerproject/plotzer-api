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
);//criar
routes.get("/", verifyPermissions, AssignmentController.get);//receber todas
routes.get("/:id_team/data/:id", verifyUserOnTeam, AssignmentController.find);//receber dados
routes.get("/:id_team/members/:id", verifyUserOnTeam, AssignmentController.getAssignmentUsers);//receber dados com os usuarios
routes.put(
  "/:id_team/:id",
  (req, res, next) => {
    res.locals.permission = teamPermissions.moderator;
    res.locals.permissionApp = false;
    next();
  },
  verifyUserHasPermissions,
  AssignmentController.update
);//atualizar
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

routes.get("/user/:id", verifyPermissions, AssignmentController.getUserAssignments);
routes.get("/@me/my-assignments", AssignmentController.me, AssignmentController.getUserAssignments);
routes.post(
  "/@me/complete-assignment",
  AssignmentController.me,
  AssignmentController.completeAssignment
);

export default routes;
