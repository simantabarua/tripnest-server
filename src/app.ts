import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server is running");
});
app.use(globalErrorHandler);
app.use(notFound);
export default app;
