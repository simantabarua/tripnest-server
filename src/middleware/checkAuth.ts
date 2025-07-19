import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelper/AppError";
import { verifyToken } from "../utils/jwt";
export const checkAuth =
  (...authRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;
    try {
      if (!accessToken) {
        throw new AppError(
          "Access token is required",
          StatusCodes.UNAUTHORIZED
        );
      }
      const verifiedToken = verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET || ""
      ) as JwtPayload;
      if (!verifiedToken) {
        throw new AppError("Invalid access token", StatusCodes.UNAUTHORIZED);
      }
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError("Unauthorized access", StatusCodes.FORBIDDEN);
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
