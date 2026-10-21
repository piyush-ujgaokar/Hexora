import { razorpay } from "../config/razorpay.js";
import paymentModel from "../models/payment.model.js";
import crypto from "crypto";
import { addCredits } from "../utils/updateCredits.js";

const Plan = {
  pro: {
    name: "Pro",
    amount: 29900,
    credits: 500,
  },
  team: {
    name: "Team",
    amount: 79900,
    credits: 2000,
  },
};

export const createOrderController = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(404).json({
        message: "UserId is not found",
      });
    }

    const { plan } = req.body;
    const selectedPlan = Plan[plan];

    if (!selectedPlan) {
      return res.status(400).json({
        message: "Plan is not found",
      });
    }

    const order = await razorpay.orders.create({
      amount: selectedPlan.amount,
      currency: "INR",
      receipt: `recept-${Date.now()}`,
      notes: { userId, plan },
    });

    const payment = await paymentModel.create({
      userId,
      plan,
      credits:selectedPlan.credits,
      amount: selectedPlan.amount,
      razorpayOrderId: order.id,
      currency: "INR",
      status: "created",
    });

    return res.status(201).json({
      message: "order Created Successfully",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      plan: {
        name: selectedPlan.name,
        credits: selectedPlan.credits,
      },
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in CreateOrder controller :- ${error}`,
    });
  }
};

export const verifyPaymentController = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(404).json({
        message: "userId not found",
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(404).json({
        message:
          " razorpay_order_id, razorpay_payment_id, razorpay_signature not Found",
      });
    }

    const payment = await paymentModel.findOne({
      razorpayOrderId: razorpay_order_id,
      userId,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not Found",
      });
    }

    if (payment.status == "paid") {
      return res.status(200).json({
        message: "Payment is Already verified",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if(razorpay_signature!==generatedSignature){
        payment.status="failed",
        await payment.save()
        return res.status(400).json({
            message:"Invalid payment Signature"
        })
    }

    const credits = await addCredits({
      userId: payment.userId,
      credits: payment.credits,
    });
    if (typeof credits !== "number") {
      throw new Error("Auth service did not return the updated credit balance");
    }

    payment.status="paid"
    payment.razorpayPaymentId=razorpay_payment_id
    await payment.save()

     return res.status(201).json({
      message: "Payment Verified Successfully",
      credits,
    });


  } catch (error) {
    return res.status(500).json({
      message: `Error in VerifyPayment controller:- ${error}`,
    });
  }
};
