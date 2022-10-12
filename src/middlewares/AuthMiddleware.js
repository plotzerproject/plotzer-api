import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";
import {
  errApplication,
  errGetUser,
  errNeedsToken,
  errTokenInvalid,
} from "../utils/errors.js";

const verifyAuthentication = async (req, res, next) => {
  const authToken =
    req.headers.authorization || req.body.token || req.query.token;
  if (!authToken)
    return res.status(errNeedsToken.status).json({ errors: [errNeedsToken] });

  const [, token] = authToken.split(" ");
  if (!token)
    return res.status(errNeedsToken.status).json({ errors: [errNeedsToken] });

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    const id = payload.sub;
    const user = await UserRepository.find(id);
    if (!user)
      return res.status(errGetUser.status).send({ errors: [errGetUser] });
    res.locals.authentication = payload;
    res.locals.user = user;
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      return res.status(errTokenInvalid.status).json({ errors: [errTokenInvalid]});
    } else if (error.message == "jwt must be provided") {
      return res.status(errNeedsToken.status).json({ errors: [errNeedsToken] });
    } else {
      return res.status(errApplication.status).json({ errors: [errApplication]});
    }
  }
};

export { verifyAuthentication };
