import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport.config";
import expressSession from "express-session";
import { envVars } from "./config/env";
const app = express();

app.use(express.json());
app.use(cors());
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server is running");
});
app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);
export default app;
