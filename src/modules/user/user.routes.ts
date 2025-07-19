import { Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema } from "./user.validated";
import { validateRequest } from "../../middleware/validatedRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";
const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);

router.get("/all-user", checkAuth(Role.ADMIN), UserController.getAllUsers);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserController.updateUser
);
export const UserRoutes = router;
