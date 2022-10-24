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
);//criar, ok
routes.get("/", verifyPermissions, AssignmentController.get);//receber todas, ok
routes.get("/:id_assignment", AssignmentController.find);//receber dados, ok
routes.get("/:id_team/members/:id", verifyUserOnTeam, AssignmentController.getAssignmentUsers);//receber dados com os usuarios, ok
routes.put(
  "/:id_team/:id",
  (req, res, next) => {
    res.locals.permission = teamPermissions.moderator;
    res.locals.permissionApp = false;
    next();
  },
  verifyUserHasPermissions,
  AssignmentController.update
);//atualizar, NAO ok
routes.delete(
  "/:id",
  (req, res, next) => {
    res.locals.permission = teamPermissions.moderator;
    res.locals.permissionApp = false;
    next();
  },
  verifyUserHasPermissions,
  AssignmentController.destroy
); //NAO OK

routes.get("/user/:id", verifyPermissions, AssignmentController.getUserAssignments); //ok
routes.get("/@me/my-assignments", AssignmentController.me, AssignmentController.getUserAssignments); //ok
routes.post(
  "/@me/complete-assignment/:id_assignment",
  AssignmentController.me,
  upload.array("userAttachments"),
  AssignmentController.completeAssignment
);//NAO OK

export default routes;
