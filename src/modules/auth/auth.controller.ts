import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthServices } from "./auth.services";
import { clearCookies, setCookies } from "../../utils/ManageCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserToken } from "../../utils/UserToken";
import { envVars } from "../../config/env";
import passport from "passport";
import AppError from "../../errorHelper/AppError";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      async (err, user, info) => {
        if (err) {
          return next(new AppError(err, StatusCodes.UNAUTHORIZED));
        }
        if (!user) {
          return next(new AppError(info.message, StatusCodes.UNAUTHORIZED));
        }
        const userToken = createUserToken(user);
        const userObj = user.toObject();
        delete userObj.password;
        setCookies(res, userToken);
        sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: "User logged in successfully",
          data: {
            accessToken: userToken.accessToken,
            refreshToken: userToken.refreshToken,
            user: userObj,
          },
        });
      }
    )(req, res, next);
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

const logout = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    clearCookies(res);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User logged out successfully",
      data: null,
    });
  }
);
const changePassword = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const changePasswordInfo = await AuthServices.changePassword(
      req.body,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password changed successfully",
      data: changePasswordInfo,
    });
  }
);

const googleAuthController = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).send("Authentication failed");
      return;
    }
    const tokenInfo = createUserToken(user);
    setCookies(res, tokenInfo);
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthController = {
  credentialLogin,
  generateNewAccessToken,
  logout,
  changePassword,
  googleAuthController,
};
