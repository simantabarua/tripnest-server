import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { generateToken } from "../../utils/jwt";

const credentialLogin = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const isPasswordValid = bcryptjs.compareSync(password, user.password || "");
  if (!isPasswordValid) {
    throw new AppError("Invalid password", StatusCodes.UNAUTHORIZED);
  }

  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return accessToken;
};

export const AuthService = {
  credentialLogin,
};
