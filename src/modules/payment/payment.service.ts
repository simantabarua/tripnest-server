import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { IUser } from "../user/user.interface";
import { sslPaymentService } from "../sslCommerz/sslCommerz.service";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment) {
    throw new AppError("Payment not found", StatusCodes.NOT_FOUND);
  }
  const booking = await Booking.findById(bookingId)
    .populate<{ user: IUser }>("user")
    .lean();

  if (!booking) {
    throw new AppError("Booking not found", StatusCodes.NOT_FOUND);
  }
  if (!booking.user || typeof booking.user === "string") {
    throw new AppError("User info not found", StatusCodes.NOT_FOUND);
  }
  const { email, address, phone, name } = booking.user;
  const sslCommerzPayload: ISSLCommerz = {
    amount: payment.amount,
    transactionId: payment.transactionId,
    name,
    email,
    phoneNumber: phone as string,
    address: address as string,
  };

  const sslPayment = await sslPaymentService.sslPaymentInit(sslCommerzPayload);
  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session }
    );

    if (!updatedPayment) {
      throw new AppError("Payment not found", StatusCodes.NOT_FOUND);
    }

    await Booking.findOneAndUpdate(
      { _id: updatedPayment.booking },
      { status: BOOKING_STATUS.COMPLETE },
      { session, runValidators: true, new: true }
    );

    await session.commitTransaction();

    return {
      success: true,
      message: "Payment success",
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.FAILED,
      },
      { new: true, runValidators: true, session }
    );
    await Booking.findOneAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.FAILED },
      { session, runValidators: true, new: true }
    );
    await session.commitTransaction();
    return {
      success: false,
      message: "Payment failed",
    };
  } catch (error) {
    session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.CANCELLED,
      },
      { new: true, runValidators: true, session }
    );
    await Booking.findOneAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CANCEL },
      { session, runValidators: true, new: true }
    );
    await session.commitTransaction();
    return {
      success: false,
      message: "Payment cancelled",
    };
  } catch (error) {
    session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const PaymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
