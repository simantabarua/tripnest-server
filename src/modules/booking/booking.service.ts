import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Tour } from "../tour/tour.model";
import { Booking } from "./booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { IUser } from "../user/user.interface";
import { sslPaymentService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // Validate user
    const user = await User.findById(userId);
    if (!user?.phone || !user.address) {
      throw new AppError("Please update your profile", StatusCodes.BAD_REQUEST);
    }

    // Validate tour
    const tour = await Tour.findById(payload.tour).select("costFrom");
    if (!tour?.costFrom) {
      throw new AppError("No tour cost found", StatusCodes.NOT_FOUND);
    }

    const amount = Number(tour.costFrom) * Number(payload.guestCount ?? 1);

    // Create booking
    const [booking] = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    // Create payment
    const [payment] = await Payment.create(
      [
        {
          booking: booking._id,
          transactionId,
          amount,
          status: PAYMENT_STATUS.UNPAID,
        },
      ],
      { session }
    );

    // Update booking with payment
    const updatedBooking = await Booking.findByIdAndUpdate(
      booking._id,
      { payment: payment._id },
      { new: true, runValidators: true, session }
    )
      .populate<{ user: IUser }>("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    if (!updatedBooking?.user) {
      throw new AppError(
        "User info could not be populated.",
        StatusCodes.BAD_REQUEST
      );
    }

    // Prepare SSLCommerz payload
    const { email, address, phone, name } = updatedBooking.user;
    const sslCommerzPayload: ISSLCommerz = {
      amount,
      transactionId,
      name,
      email,
      phoneNumber: phone as string,
      address: address as string,
    };

    const sslPayment = await sslPaymentService.sslPaymentInit(
      sslCommerzPayload
    );
    await session.commitTransaction();

    return {
      payment: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getUserBookings = async () => {
  return {};
};

const getBookingById = async () => {
  return {};
};

const updateBookingStatus = async () => {
  return {};
};

const getAllBookings = async () => {
  return {};
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
};
