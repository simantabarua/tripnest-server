import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionService } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.createDivision(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Division created",
    data: result,
  });
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const divisionId = req.params.id;
  const result = await DivisionService.updateDivision(divisionId, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Division updated",
    data: result,
  });
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const divisionId = req.params.id;
  const result = await DivisionService.deleteDivision(divisionId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Division deleted",
    data: result,
  });
});

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await DivisionService.getSingleDivision(slug);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Division retrieved",
    data: result,
  });
});
const getAllDivisions = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.getAllDivisions();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Divisions retrieved",
    data: result,
    meta: {
      total: result.length,
    },
  });
});

export const DivisionController = {
  createDivision,
  updateDivision,
  deleteDivision,
  getSingleDivision,
  getAllDivisions,
};
