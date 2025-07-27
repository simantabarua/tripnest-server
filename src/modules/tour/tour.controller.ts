import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TourService } from "./tour.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createTour = catchAsync(async (req: Request, res: Response) => {
  const tour = await TourService.createTour(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Tour created successfully",
    data: tour,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const tourId = req.params.id;
  const payload = req.body;
  const updatedTour = await TourService.updateTour(tourId, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tour updated successfully",
    data: updatedTour,
  });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const tourId = req.params.id;
  await TourService.deleteTour(tourId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tour deleted successfully",
  });
});

const getTourById = catchAsync(async (req: Request, res: Response) => {
  const tourId = req.params.id;
  const tour = await TourService.getTourById(tourId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tour retrieved successfully",
    data: tour,
  });
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TourService.getAllTours(query as Record<string, string>);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tours retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const createTourType = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const tourType = await TourService.createTourType(name);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Tour type created successfully",
    data: tourType,
  });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const tourTypeId = req.params.id;
  await TourService.deleteTourType(tourTypeId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tour type deleted successfully",
  });
});

const getAllTourTypes = catchAsync(async (_req: Request, res: Response) => {
  const tourTypes = await TourService.getAllTourTypes();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tour types retrieved successfully",
    data: tourTypes,
  });
});

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
