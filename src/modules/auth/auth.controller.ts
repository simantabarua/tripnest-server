import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "./auth.service";

const credentialLogin = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const loginInfo = await AuthService.credentialLogin(email, password);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User logged in successfully",
      data: loginInfo,
    });
  }
);

export const AuthController = {
  credentialLogin,
};
