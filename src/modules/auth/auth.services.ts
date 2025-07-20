import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { createNewAccessToken, createUserToken } from "../../utils/UserToken";
import { IUser } from "../user/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const isPasswordValid = bcryptjs.compareSync(
    password as string,
    user.password || ""
  );
  if (!isPasswordValid) {
    throw new AppError("Invalid password", StatusCodes.UNAUTHORIZED);
  }
  const userToken = createUserToken(user);
  const userObj = user.toObject();
  delete userObj.password;
  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: userObj,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessToken(refreshToken);
  return {
    accessToken: newAccessToken,
  };
};
interface ChangePasswordPayload {
  oldPassword: string;

  newPassword: string;
}
const changePassword = async (
  payload: ChangePasswordPayload,
  decodedToken: JwtPayload
) => {
  const { oldPassword, newPassword } = payload;
  const user = await User.findOne({ email: decodedToken.email });
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const isPasswordValid = bcryptjs.compareSync(
    oldPassword,
    user.password as string
  );
  if (!isPasswordValid) {
    throw new AppError("Invalid old password", StatusCodes.UNAUTHORIZED);
  }
  const hashedNewPassword = bcryptjs.hashSync(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user.password = hashedNewPassword;
  await user.save();
};
export const AuthServices = {
  credentialLogin,
  getNewAccessToken,
  changePassword,
};
