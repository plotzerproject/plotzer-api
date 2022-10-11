import UserRepository from "../../repositories/v1/UserRepository.js";
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
} from "../../utils/v1/errors.js";

import bcrypt from "bcrypt";
import {
  userSuccessReturn,
  userSuccessReturnToken,
} from "../../utils/v1/returns.js";
import { GenerateAuthToken } from "./generateAuthToken.js";
import { userSchema } from "../../schemas/v1/UserSchema.js";

class UserController {
  async create(req, res, next) {
    console.log(req.body);
    let { name, email, password, plan, photo, teams, applicationPermissions } =
      req.body;

    try {
      //verify if user already exists
      const userExists = await UserRepository.verifyEmail(email);
      if (userExists)
        return res
          .status(errUserAlreadyExists.status)
          .json({ errors: [errUserAlreadyExists] });

      if (password) {
        // create a password hash (bcrypt)
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
        password = passwordHash;
      }

      /*to do: upload photo*/
      // const { file } = req
      // if (!photo && file) {
      //     photo = `${process.env.SERVER_SECURITY}${process.env.SERVER_URL}:${process.env.SERVER_PORT}/api/v1/uploads/${file.filename}`
      //     // await uploadFilesController.UploadImageService(file) //algo pro futuro com cloud
      // }

      //validate data
      if (!(await userSchema.isValid(data))) {
        return res
          .status(400)
          .json({ error: "Error on validate user schema." });
      }

      //create user
      const user = await UserRepository.create(
        name,
        email,
        password,
        plan,
        photo,
        teams,
        applicationPermissions
      );

      //create JWT token
      const generateToken = new GenerateAuthToken();
      const token = await generateToken.generate(user.id);

      //return success
      return res
        .status(200)
        .json({ data: userSuccessReturnToken(user, token) });
    } catch (error) {
      return res.status(errCreateUser.status).json({ errors: [errCreateUser] });
    }
  }
  async get(req, res, next) {
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
    const { id } = req.params;
    try {
      const user = await UserRepository.find(id);
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
  async update(req, res, next) {
    const { id } = req.params;
    let { name, email, password, plan, photo, teams, applicationPermissions } =
      req.body;
    const data = {
      name,
      email,
      password,
      plan,
      photo,
      teams,
      applicationPermissions,
    };

    const { file } = req;
    if (!photo && file) {
      photo = `${process.env.SECURITY}${process.env.URL}:${process.env.PORT}/api/v1/uploads/${file.filename}`;
      // await uploadFilesController.UploadImageService(file) //algo pro futuro com cloud
    }

    if (!(await userSchema.isValid(data))) {
      return res.status(400).json({ error: "Error on validate user schema." });
    }

    try {
      const user = await UserRepository.update(id, data);
      if (user == null)
        return res
          .status(errUserNotFound.status)
          .json({ errors: [errUserNotFound] });

      return res.status(200).json({ data: userSuccessReturn(user) });
    } catch (error) {
      return res.status(errUpdateUser.status).json({ errors: [errUpdateUser] });
    }
  }
  async destroy(req, res, next) {
    const { id } = req.params;

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

  async login(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await UserRepository.login(email);
      if (user == null || !user.password)
        return res
          .status(errUserIncorrect.status)
          .json({ errors: [errUserIncorrect] });

      //usa a lib bcrypt e verifica se a senha da requisição ao ser criptografada bate com a senha salva no mongo, caso contrario retorna que o email/senha ta incorreto
      const checkPassword = bcrypt.compare(password, user.password);
      if (!checkPassword)
        return res
          .status(errUserIncorrect.status)
          .json({ errors: [errUserIncorrect] });

      //passa o id do usuario para esta classe que retorna um token JWT criptografado
      const generateToken = new GenerateAuthToken();
      const token = await generateToken.generate(user.id);

      //caso de tudo certo, retorna status 200(ok) e o token para uso
      return res.status(200).json(userSuccessReturnToken(user, token));
    } catch (error) {
      console.error(error);
      //caso aconteça algum erro no login, ele manda uma mensagem de erro padronizada (preciso fazer mais verificações dps)
      return res.status(errLogIn.status).json({ errors: [errLogIn] });
    }
  }
  async getMyTeams(req, res, next) {
    const { id } = req.params;
    try {
      const teams = await UserRepository.getMyTeams(id);
      if (teams == null)
        return res
          .status(errUserNotFound.status)
          .json({ errors: [errUserNotFound] });
      if (teams == false)
        return res
          .status(errUserDontHaveATeam.status)
          .json({ errors: [errUserDontHaveATeam] });

      return res.send(teams);
    } catch (error) {
      console.error(error);
      return res.status(errGetTeam.status).json({ errors: [errGetTeam] });
    }
  }
}

export default new UserController();
