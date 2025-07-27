import { Router } from "express";
import { TourController } from "./tour.controller";
import { createTourValidationZodSchema } from "./tour.validation";
import { validateRequest } from "../../middleware/validatedRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

// ===== 🎯 Public or Authenticated Routes =====

// Get all tours (accessible to USER & ADMIN)
router.get("/", checkAuth(Role.USER, Role.ADMIN), TourController.getAllTours);

// Get a single tour by ID
router.get(
  "/:id",
  checkAuth(Role.USER, Role.ADMIN),
  TourController.getTourById
);

// ===== 🛠️ Admin-only: Tour Management =====

// Create a new tour
router.post(
  "/create",
  checkAuth(Role.ADMIN),
  validateRequest(createTourValidationZodSchema),
  TourController.createTour
);

// Update a tour
router.patch("/:id", checkAuth(Role.ADMIN), TourController.updateTour);

// Delete a tour
router.delete("/:id", checkAuth(Role.ADMIN), TourController.deleteTour);

// ===== 🧭 Tour Type Management =====

// Create tour type
router.post(
  "/tour-type/create",
  checkAuth(Role.ADMIN),
  TourController.createTourType
);

// Delete tour type
router.delete(
  "/tour-type/:id",
  checkAuth(Role.ADMIN),
  TourController.deleteTourType
);

// Get all tour types
router.get(
  "/tour-type/all",
  checkAuth(Role.USER, Role.ADMIN),
  TourController.getAllTourTypes
);

export const TourRoutes = router;
