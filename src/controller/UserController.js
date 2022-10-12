import UserRepository from "../repositories/UserRepository.js";
import {
  errCreateUser,
  errDeleteUser,
  errGetTeam,
  errGetUser,
  errLogIn,
  errUpdateUser,
  errUserAlreadyExists,
  errUserDontHaveATeam,
  errUserIncorrect,
  errUserNotFound,
} from "../utils/errors.js";

import {
  userSuccessReturn,
  userSuccessReturnToken,
} from "../utils/returns.js";

class UserController {
  // async get(req, res, next) {
  //   try {
  //     const users = await UserRepository.get();
  //     if (users.length == 0)
  //       return res
  //         .status(errUserNotFound.status)
  //         .json({ errors: [errUserNotFound] });
  //     return res.status(200).json({ data: users.map(userSuccessReturn) });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(errGetUser.status).json({ errors: [errGetUser] });
  //   }
  // }

  // async find(req, res, next) {
  //   const { id } = req.params;
  //   try {
  //     const user = await UserRepository.find(id);
  //     if (user == null)
  //       return res
  //         .status(errUserNotFound.status)
  //         .json({ errors: [errUserNotFound] });

  //     return res.status(200).json({ data: userSuccessReturn(user) });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(errGetUser.status).json({ errors: [errGetUser] });
  //   }
  // }

  // async update(req, res, next) {
  //   const { id } = req.params;
  //   let { name, email, password, plan, photo, teams, applicationPermissions } =
  //     req.body;
  //   const data = {
  //     name,
  //     email,
  //     password,
  //     plan,
  //     photo,
  //     teams,
  //     applicationPermissions,
  //   };

  //   const { file } = req;
  //   if (!photo && file) {
  //     photo = `${process.env.SECURITY}${process.env.URL}:${process.env.PORT}/api/v1/uploads/${file.filename}`;
  //     // await uploadFilesController.UploadImageService(file) //algo pro futuro com cloud
  //   }

  //   if (!(await userSchema.isValid(data))) {
  //     return res.status(400).json({ error: "Error on validate user schema." });
  //   }

  //   try {
  //     const user = await UserRepository.update(id, data);
  //     if (user == null)
  //       return res
  //         .status(errUserNotFound.status)
  //         .json({ errors: [errUserNotFound] });

  //     return res.status(200).json({ data: userSuccessReturn(user) });
  //   } catch (error) {
  //     return res.status(errUpdateUser.status).json({ errors: [errUpdateUser] });
  //   }
  // }
  // async destroy(req, res, next) {
  //   const { id } = req.params;

  //   try {
  //     const plan = await UserRepository.destroy(id);

  //     if (plan == null)
  //       return res
  //         .status(errUserNotFound.status)
  //         .json({ errors: [errUserNotFound] });
  //     return res.status(200).json({ data: "Usuário deletado com sucesso!" });
  //   } catch (error) {
  //     return res.status(errDeleteUser.status).json({ errors: [errDeleteUser] });
  //   }
  // }

  async getMyTeams(req, res, next) {
    try {
      const id = res.locals.user.id
      const teams = await UserRepository.getMyTeams(id);
      if (teams == null)
        return res
          .status(errUserNotFound.status)
          .json({ errors: [errUserNotFound] });
      if (teams == false)
        return res
          .status(errUserDontHaveATeam.status)
          .json({ errors: [errUserDontHaveATeam] });
      console.log(teams)
      
      return res.status(200).json(teams);
    } catch (error) {
      console.error(error);
      return res.status(errGetTeam.status).json({ errors: [errGetTeam] });
    }
  }
}

export default new UserController();
