import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthServices } from "./auth.services";
import { setCookies } from "../../utils/setCookie";

const credentialLogin = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialLogin(req.body);

    setCookies(res, loginInfo);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User logged in successfully",
      data: loginInfo,
    });
  }
);
const generateNewAccessToken = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );

    setCookies(res, tokenInfo);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "New access token generated successfully",
      data: refreshToken,
    });
  }
);
export const AuthController = {
  credentialLogin,
  generateNewAccessToken,
};
