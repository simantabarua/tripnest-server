import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validedRequest";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
router.get("/all-user", UserController.getAllUsers);

export const UserRoutes = router;
