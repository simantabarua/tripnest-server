import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, ...rest } = payload;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(
      "User already exists with this email",
      StatusCodes.BAD_REQUEST
    );
  }
  const user = await User.create({
    email,
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
