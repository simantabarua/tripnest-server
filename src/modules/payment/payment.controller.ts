import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.initPayment(req.params.bookingId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment done successfully",
    data: result,
  });
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.successPayment(
    query as Record<string, string>
  );
  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=success`
    );
  }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.failPayment(
    query as Record<string, string>
  );
  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=failed`
    );
  }
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.cancelPayment(
    query as Record<string, string>
  );
  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=cancelled`
    );
  }
});

export const PaymentController = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
