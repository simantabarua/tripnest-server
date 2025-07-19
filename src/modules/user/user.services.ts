import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { createUserZodSchema } from "./user.validated";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = createUserZodSchema.parse(payload);
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
    role: "USER",
    ...rest,
  });
  return user;
};

const UpdateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
): Promise<IUser | null> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  if (user.isDeleted === true) {
    throw new AppError("User is deleted", StatusCodes.BAD_REQUEST);
  }

  // --- Role update permissions ---
  if (payload.role) {
    const requesterRole = decodedToken.role;
    const isSelfUpdate = decodedToken.id === userId;

    // Prevent anyone from changing their own role
    if (isSelfUpdate) {
      throw new AppError(
        "You cannot change your own role",
        StatusCodes.FORBIDDEN
      );
    }

    // Regular users and guides cannot change roles
    if (requesterRole === Role.USER || requesterRole === Role.GUIDE) {
      throw new AppError("You cannot change roles", StatusCodes.FORBIDDEN);
    }

    // Admins cannot assign SUPER_ADMIN role
    if (requesterRole === Role.ADMIN && payload.role === Role.SUPER_ADMIN) {
      throw new AppError(
        "Admins cannot assign Super Admin role",
        StatusCodes.FORBIDDEN
      );
    }

    // Only SUPER_ADMIN can change roles of other users
    if (requesterRole !== Role.SUPER_ADMIN && requesterRole !== Role.ADMIN) {
      throw new AppError("You are not authorized", StatusCodes.FORBIDDEN);
    }
  }

  // --- Handle password update ---
  if (payload.password) {
    user.password = bcryptjs.hashSync(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
    await user.save(); // Save hashed password separately
    delete payload.password;
  }

  // --- Perform the update ---
  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
  });

  return updatedUser;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

export const UserService = {
  createUser,
  getAllUsers,
  UpdateUser,
};
