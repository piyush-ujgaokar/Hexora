import { axiosInstance } from "../../utils/axiosInstance";

export const createPaymentApi = async (plan) => {
  const { data } = await axiosInstance.post("/api/payment/create", { plan });
  return data;
};


export const verifyPaymentApi = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
    
  const { data } = await axiosInstance.post("/api/payment/verify", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return data;
};
