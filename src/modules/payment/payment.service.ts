const initPayment = async (bookingId: string) => {
  // Empty implementation
};

const successPayment = async (query: Record<string, string>) => {
  // Empty implementation
};

const failPayment = async (query: Record<string, string>) => {
  // Empty implementation
};

const cancelPayment = async (query: Record<string, string>) => {
  // Empty implementation
};

export const PaymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
