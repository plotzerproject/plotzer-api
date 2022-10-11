import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import UserToken from "../model/UserToken.js";

class CreateSession {
  async execute(email, _id) {
    try {
      const token = jwt.sign({}, process.env.JWT_ACCESS_TOKEN, {
        subject: _id,
        expiresIn: process.env.JWT_EXPIRES_IN_TOKEN,
      });

      const refresh_token = jwt.sign({ email }, process.env.JWT_REFRESH_TOKEN, {
        subject: _id,
        expiresIn: process.env.JWT_EXPIRES_IN_REFRESH_TOKEN,
      });

      const refresh_token_expires_date = dayjs()
        .add(process.env.JWT_EXPIRES_REFRESH_TOKEN_DAYS, "days")
        .toDate();

      const refresh_token_created = await UserToken.create({
        user_id: _id,
        refresh_token,
        expires_date: refresh_token_expires_date,
      });

      await refresh_token_created.save();

      return { token, refresh_token };

    } catch (error) {
      return new Error("token")
    }
  }
}

export { CreateSession };
