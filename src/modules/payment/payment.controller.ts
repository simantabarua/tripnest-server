import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const initPayment = catchAsync(async (req: Request, res: Response) => {
    // Empty implementation
    const d
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
    // Empty implementation
});

const failPayment = catchAsync(async (req: Request, res: Response) => {

});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
    // Empty implementation
});

export const PaymentController = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};
