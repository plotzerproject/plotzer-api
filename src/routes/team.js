import { Router } from "express";
const routes = Router();

import TeamController from "../controller/TeamController.js";

import multer from "multer";
import multerConfig from "../config/multer.js";
import {
  teamPermissions,
  verifyPermissions,
  verifyUserOnTeam,
  verifyUserHasPermissions,
} from "../middlewares/VerifyUser.js";
const upload = multer(multerConfig);

routes.post("/", TeamController.create); //ok
routes.get("/:id_team", verifyUserOnTeam, TeamController.find); //ok
routes.get("/", verifyPermissions, TeamController.get); //ok
routes.put(
  "/:id_team",
  (req, res, next) => {
    res.locals.permission = teamPermissions.supervisor;
    next();
  },
  verifyUserHasPermissions,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  TeamController.update
);
routes.delete("/:id_team",   (req, res, next) => {
  res.locals.permission = teamPermissions.owner;
  next();
},
verifyUserHasPermissions, TeamController.destroy);

routes.post(
  "/:id_team/fixed/",
  (req, res, next) => {
    res.locals.permission = teamPermissions.supervisor;
    next();
  },
  verifyUserHasPermissions,
  TeamController.addFixed
); //arrumar o middleware de permissão
routes.get("/:id_team/fixed/", verifyUserOnTeam, TeamController.getFixed);

routes.get("/:id_team/members", verifyUserOnTeam, TeamController.getMembers);
routes.get(
  "/:id_team/members/:id_member",
  verifyUserOnTeam,
  TeamController.getMember
); //get a specific member

routes.post("/accept/:id_team", TeamController.acceptJoinTeam);
// routes.post("/accept/:id_team", TeamController.acceptRequestTeam);//como fazer?

routes.post(
  "/:id_team/members/invite",
  (req, res, next) => {
    res.locals.permission = teamPermissions.moderator;
    next();
  },
  verifyUserHasPermissions,
  TeamController.addMember
);
routes.post(
  "/:id_team/members/remove",
  (req, res, next) => {
    res.locals.permission = teamPermissions.moderator;
    next();
  },
  verifyUserHasPermissions,
  TeamController.removeMember
);

routes.post("/:id_team/join", TeamController.joinTeam)
routes.post(
  "/:id_team/accept",
  (req, res, next) => {
    res.locals.permission = teamPermissions.moderator;
    next();
  },
  verifyUserHasPermissions,
  TeamController.acceptRequestTeam
);
routes.get(
  "/:id_team/requests",
  (req, res, next) => {
    res.locals.permission = teamPermissions.moderator;
    res.locals.permissionApp = true
    next();
  },
  verifyUserHasPermissions,
  TeamController.getRequests
);
routes.post("/members/:id_team/leave", TeamController.leaveTeam)


routes.get("/@me/:id_team/stats", TeamController.me, TeamController.getUserStats);
routes.get("/:id_team/:id_user/stats", TeamController.getUserStats);

routes.get("/:id_team/stats", verifyUserOnTeam, TeamController.getTeamStats);
export default routes;
