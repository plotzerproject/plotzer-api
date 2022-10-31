import UserRepository from "../repositories/UserRepository.js";
import {
  errDeleteUser,
  errGetTeam,
  errGetUser,
  errInvalidData,
  errUpdateUser,
  errUserAlreadyExists,
  errUserDontHaveATeam,
  errUserNotFound,
} from "../utils/errors.js";

import {
  teamSuccessReturn,
  userSuccessReturn,
  userSuccessReturnToken,
} from "../utils/returns.js";
import { salt } from "./AuthController.js";
import fs from 'fs'
import multerConfig from '../config/multer.js'

class UserController {
  async me(req, res, next) { //ok
    res.locals.id = res.locals.user.id;
    next();
  }
  async get(req, res, next) {    //ok
    try {
      const users = await UserRepository.get();
      if (users.length == 0)
        return res
          .status(errUserNotFound.status)
          .json({ errors: [errUserNotFound] });
      return res.status(200).json({ data: users.map(userSuccessReturn) });
    } catch (error) {
      console.error(error);
      return res.status(errGetUser.status).json({ errors: [errGetUser] });
    }
  }

  async find(req, res, next) {
    //ok
    let { id } = req.params;
    if (res.locals.id) id = res.locals.id;

    try {
      const user = await UserRepository.find({_id: id});
      if (user == null)
        return res
          .status(errUserNotFound.status)
          .json({ errors: [errUserNotFound] });

      return res.status(200).json({ data: userSuccessReturn(user) });
    } catch (error) {
      console.log(error);
      return res.status(errGetUser.status).json({ errors: [errGetUser] });
    }
  }

  async update(req, res, next) { //ok
    // let { id } = req.params;
    // if (res.locals.id) id = res.locals.id
    const id = res.locals.id;

    let { name, email, password, plan, photo, background } = req.body;

    try {
      const { files } = req;
      const fileNames = Object.keys(files);
      if (fileNames.length !== 0) {
        if (!photo && files["photo"]) {
          // files.photo[0].filename = files.photo[0].filename.split(" ").join("%20");
          photo = `${process.env.SECURITY}${process.env.URL}:${process.env.PORT}/api/uploads/${files.photo[0].filename}`;
          // await uploadFilesController.UploadImageService(file) //algo pro futuro com cloud
        }
        if (!background && files["background"]) {
          // files.background[0].filename = files.background[0].filename.split(" ").join("%20");
          background = `${process.env.SECURITY}${process.env.URL}:${process.env.PORT}/api/uploads/${files.background[0].filename}`;
        }
      }
      
      const emailExists = await UserRepository.find({_id: id})
      if (email && emailExists.email == email && emailExists.id != id) {
        throw new Error("ERR_USER_EXISTS");
      }
      const user = res.locals.user
      if (photo && user.photo) {
        const filename = user.photo.split("http://localhost:4000/api/uploads/")[1]
        fs.unlinkSync(`${multerConfig.directory}/${filename}`);
      }
      if (background && user.background) {
        const filename = user.background.split("http://localhost:4000/api/uploads/")[1]
        fs.unlinkSync(`${multerConfig.directory}/${filename}`);
      }
      if (password) {
        const passwordHash = await bcrypt.hash(password, salt);
        password = passwordHash;
      }
      if (plan) {
        plan = {
          id: plan,
          purchaseDate: Date.now(),
          active: true,
        };
      }

      const data = {
        name,
        email,
        password,
        plan,
        photo,
        background,
      };

      const userUpdate = await UserRepository.update(id, data);
      if (userUpdate == null)
        return res
          .status(errUserNotFound.status)
          .json({ errors: [errUserNotFound] });

      return res.status(200).json({ data: userSuccessReturn(userUpdate) });
    } catch (error) {
      console.log(error);
      if (error.message == "ERR_USER_EXISTS") {
        return res
          .status(errUserAlreadyExists.status)
          .json({ errors: [errUserAlreadyExists] });
      } else {
        return res
          .status(errUpdateUser.status)
          .json({ errors: [errUpdateUser] });
      }
    }
  }

  async updatePermissions(req, res, next) { //ok
    const { id } = req.params;
    const { applicationPermissions } = req.body;
    if (!applicationPermissions)
      return res
        .status(errInvalidData.status)
        .json({ errors: [errInvalidData] });
    try {
      const data = {
        applicationPermissions
      }
      const user = await UserRepository.update(id, data);
      if (user == null)
        return res
          .status(errUserNotFound.status)
          .json({ errors: [errUserNotFound] });

      return res.status(200).json({ data: user });
    } catch (error) {
      return res.status(errUpdateUser.status).json({ errors: [errUpdateUser] })
    }
  }

  async destroy(req, res, next) { //acho que sim mas preguiça de testar
    let { id } = req.params;
    if (res.locals.id) id = res.locals.id;

    try {
      const plan = await UserRepository.destroy(id);

      if (plan == null)
        return res
          .status(errUserNotFound.status)
          .json({ errors: [errUserNotFound] });
      return res.status(200).json({ data: "Usuário deletado com sucesso!" });
    } catch (error) {
      return res.status(errDeleteUser.status).json({ errors: [errDeleteUser] });
    }
  }

  async getUserTeams(req, res, next) {    //ok
    let { id } = req.params;
    if (res.locals.id) id = res.locals.id;

    try {
      const teams = await UserRepository.getUserTeamsPopulate(id);
      if (teams == null)
        return res
          .status(errUserNotFound.status)
          .json({ errors: [errUserNotFound] });
      if (teams == false)
        return res
          .status(errUserDontHaveATeam.status)
          .json({ errors: [errUserDontHaveATeam] });

      return res.status(200).json({ data: teams.map((t)=>(
        teamSuccessReturn(t, true)
      )) });
    } catch (error) {
      console.error(error);
      return res.status(errGetTeam.status).json({ errors: [errGetTeam] });
    }
  }

  async getUserStats(req, res, next) {
    
  }
}

export default new UserController();
