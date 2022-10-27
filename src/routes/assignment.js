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
  verifyUserHasPermissionsAssignments,
  verifyUserOnTeam,
} from "../middlewares/VerifyUser.js";
import UserAssignmentRepository from "../repositories/UserAssignmentRepository.js";
import { errApplication, errAssignmentNotFound } from "../utils/errors.js";
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
); //criar, ok
routes.get("/", verifyPermissions, AssignmentController.get); //receber todas, ok
routes.get("/:id_assignment", AssignmentController.find); //receber dados, ok
routes.get(
  "/:id_team/members/:id",
  verifyUserOnTeam,
  AssignmentController.getAssignmentUsers
); //receber dados com os usuarios, ok
routes.get(
  "/:id_team/user/:id",
  verifyUserOnTeam,
  AssignmentController.getTeamAssignments
); //receber as tarefas de uma equipe em especifico, ok
routes.put(
  "/:id",
  (req, res, next) => {
    res.locals.permission = teamPermissions.moderator;
    res.locals.permissionApp = false;
    next();
  },
  verifyUserHasPermissionsAssignments,
  AssignmentController.update
); //atualizar, NAO ok
routes.delete(
  "/:id",
  (req, res, next) => {
    res.locals.permission = teamPermissions.moderator;
    res.locals.permissionApp = false;
    next();
  },
  verifyUserHasPermissionsAssignments,
  AssignmentController.destroy
); //NAO OK

routes.get(
  "/user/:id",
  verifyPermissions,
  AssignmentController.getUserAssignments
); //ok
routes.get(
  "/@me/my-assignments",
  AssignmentController.me,
  AssignmentController.getUserAssignments
); //ok

routes.get(
  "/@me/team/:id_team/",
  AssignmentController.me,
  verifyUserOnTeam,
  AssignmentController.getTeamAssignments
); //receber as tarefas de uma equipe em especifico, ok
routes.post(
  "/@me/complete-assignment/:id_assignment",
  AssignmentController.me,
  async (req, res, next) => {
    try {
      const { index, assignment } =
        await UserAssignmentRepository.verifyUserHasAssignment(
          req.params.id_assignment,
          res.locals.user.id
        );
      res.locals.index = index;
      res.locals.assignment = assignment;
      next();
    } catch (error) {
      if (error.message == "ERR_ASSIGNMENT_NOT_FOUND") {
        return res
          .status(errAssignmentNotFound.status)
          .json({ errors: [errAssignmentNotFound] });
      } else {
        return res
          .status(errApplication.status)
          .json({ errors: [errApplication] });
      }
    }
  },
  upload.array("userAttachments"),
  AssignmentController.completeAssignment
); //ok

export default routes;
