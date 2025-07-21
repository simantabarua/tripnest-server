import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TourService } from "./tour.service";

const createTour = async (req: Request, res: Response) => {
  const tour = await TourService.createTour(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Tour created successfully",
    data: tour,
  });
};

const updateTour = async (req: Request, res: Response) => {
  const tourId = req.params.id;
  const payload = req.body;
  const updatedTour = await TourService.updateTour(tourId, payload);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Tour updated successfully",
    data: updatedTour,
  });
};

const deleteTour = async (req: Request, res: Response) => {
  const tourId = req.params.id;
  await TourService.deleteTour(tourId);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Tour deleted successfully",
  });
};
const getTourById = async (req: Request, res: Response) => {
  const tourId = req.params.id;
  const tour = await TourService.getTourById(tourId);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Tour retrieved successfully",
    data: tour,
  });
};
const getAllTours = async (req: Request, res: Response) => {
  const tours = await TourService.getAllTours();
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Tours retrieved successfully",
    data: tours,
  });
};
const createTourType = async (req: Request, res: Response) => {
  const { name } = req.body;
  const tourType = await TourService.createTourType(name);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Tour type created successfully",
    data: tourType,
  });
};
const deleteTourType = async (req: Request, res: Response) => {
  const tourTypeId = req.params.id;
  await TourService.deleteTourType(tourTypeId);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Tour type deleted successfully",
  });
};
const getAllTourTypes = async (req: Request, res: Response) => {
  const tourTypes = await TourService.getAllTourTypes();
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Tour types retrieved successfully",
    data: tourTypes,
  });
};

export const TourController = {
  createTour,
  updateTour,
  deleteTour,
  getTourById,
  getAllTours,
  createTourType,
  deleteTourType,
  getAllTourTypes,
};
