import { Router } from "express";
import { createTourValidationZodSchema } from "./tour.validation";
import { validateRequest } from "../../middleware/validatedRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { TourController } from "./tour.controller";
import { Role } from "../user/user.interface";
const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN),
  validateRequest(createTourValidationZodSchema),
  TourController.createTour
);
router.get(
  "/all-tours",
  checkAuth(Role.USER, Role.ADMIN),
  TourController.getAllTours
);
router.patch("/:id", checkAuth(Role.ADMIN), TourController.updateTour);

router.delete("/:id", checkAuth(Role.ADMIN), TourController.deleteTour);

router.get(
  "/:id",
  checkAuth(Role.USER, Role.ADMIN),
  TourController.getTourById
);

router.post(
  "/tour-type-create",
  checkAuth(Role.ADMIN),
  TourController.createTourType
);
router.delete(
  "/tour-type/:id",
  checkAuth(Role.ADMIN),
  TourController.deleteTourType
);
router.get(
  "/tour-type-all",
  checkAuth(Role.USER, Role.ADMIN),
  TourController.getAllTourTypes
);

export const TourRoutes = router;
