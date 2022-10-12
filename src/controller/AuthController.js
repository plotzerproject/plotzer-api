import UserRepository from "../repositories/UserRepository.js";
import bcrypt from "bcrypt";
import {
  errApplication,
  errCreateToken,
  errCreateUser,
  errLogIn,
  errNeedsToken,
  errUserAlreadyExists,
  errUserIncorrect,
  errUserNotFound,
  errUserTokenNotFound,
} from "../utils/errors.js";
import { userSuccessReturnToken } from "../utils/returns.js";
import { CreateSession } from "../services/SessionService.js";
import { RefreshTokenService } from "../services/RefreshTokenService.js";
import mongoose from "mongoose";

class AuthController {
  async create(req, res, next) {
    let { name, email, password, plan, photo, teams, applicationPermissions } =
      req.body;

    try {
      //verify if email already exists
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

      /*to do: validate data */
      //   if (!(await userSchema.isValid(data))) {
      //     return res
      //       .status(400)
      //       .json({ error: "Error on validate user schema." });
      //   }

      plan = {
        id: mongoose.Types.ObjectId(plan)
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

      //create tokens
      const session = new CreateSession();
      const token = await session.execute(email, user.id);

      //return success
      return res
        .status(200)
        .json({ data: userSuccessReturnToken(user, token) });
    } catch (error) {
      console.log(error)
      if (error.message == "token") {
        return res
          .status(errCreateToken.status)
          .json({ errors: [errCreateToken] });
      } else {
        return res
          .status(errCreateUser.status)
          .json({ errors: [errCreateUser] });
      }
    }
  }

  async authenticate(req, res, next) {
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

      //create tokens
      const session = new CreateSession();
      const token = await session.execute(email, user.id);

      return res.status(200).json(userSuccessReturnToken(user, token));
    } catch (error) {
      console.error(error);
      if (error.message == "token") {
        return res
          .status(errCreateToken.status)
          .json({ errors: [errCreateToken] });
      } else {
        return res.status(errLogIn.status).json({ errors: [errLogIn] });
      }
    }
  }

  async refresh(req, res, next) {
    try {
      const token = req.body.refresh_token;

      const refresh_token_service = new RefreshTokenService(); 

      const refresh_token_response = await refresh_token_service.execute(token);

      console.log('refresh token response authcontroller', refresh_token_response)

      return res.status(201).json(refresh_token_response);
    } catch (error) {
      if (error.message == "ERR_USER_NOT_FOUND_TOKEN") {
        return res
          .status(errUserTokenNotFound.status)
          .json({ errors: [errUserTokenNotFound] });
      } else if (error.message == "token") {
        return res
          .status(errCreateToken.status)
          .json({ errors: [errCreateToken] });
      } else {
        return res
          .status(errCreateToken.status)
          .json({ errors: [errCreateToken] });
      }
    }
  }
}

export default new AuthController();
