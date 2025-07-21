import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validatedRequest";
import { createDivisionValidation } from "./division.validation";
import { DivisionController } from "./division.controller";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createDivisionValidation),
  DivisionController.createDivision
);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.updateDivision
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.deleteDivision
);
router.get(
  "/:slug",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.getSingleDivision
);
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.getAllDivisions
);

export const DivisionRoutes = router;
