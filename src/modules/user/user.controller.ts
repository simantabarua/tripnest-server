/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./user.interface";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload: Partial<IUser> = req.body;
    const verifiedUser = req.user as JwtPayload;

    const user = await UserService.UpdateUser(userId, payload, verifiedUser);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User updated successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.getAllUsers();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Users retrieved successfully",
      data: users,
      meta: {
        totalCount: users.length,
      },
    });
  }
);
export const UserController = {
  createUser,
  updateUser,
  getAllUsers,
};
