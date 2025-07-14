import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(
      "User already exists with this email",
      StatusCodes.BAD_REQUEST
    );
  }
  const hashedPassword = bcryptjs.hashSync(password as string, 10);
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    auths: [authProvider],
    password: hashedPassword,
    ...rest,
  });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

export const UserService = {
  createUser,
  getAllUsers,
};
