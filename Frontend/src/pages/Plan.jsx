import { ArrowLeft, Check, Crown, Icon, Sparkle, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { createPaymentApi, verifyPaymentApi } from "../features/api/payment";
import { setUserData } from "../redux/userSlice";

const plans = [
  {
    key: "free",
    name: "Free",
    description: "For trying out the Hexora IDE.",
    price: "₹0",
    period: "/month",
    credits: "100 AI credits",
    icon: Zap,
    features: [
      "100 AI credits / month",
      "AI code generation",
      "Project editor",
      "HTML / CSS / JS preview",
      "React preview",
      "Basic project management",
    ],
    button: "Current Plan",
    current: true,
  },
  {
    key: "pro",
    name: "Pro",
    description: "For Developers Who Build Regularly.",
    price: "₹299",
    period: "/month",
    popular: true,
    credits: "500 AI credits",
    icon: Sparkle,
    features: [
      "500 AI credits / month",
      "Everything in Free",
      "Priority AI generation",
      "Larger Projects",
      "Unlimited Projects",
      "Advanced AI coding",
      "Priority Support",
    ],
    button: "Upgrade to Pro",
  },
  {
    key: "team",
    name: "Team",
    description: "For Teams building products together",
    price: "₹799",
    period: "/month",
    credits: "2,000 AI credits",
    icon: Crown,
    features: [
      "2,000 AI credits / month",
      "Everything in pro",
      "Team Collaboration",
      "Shared Projects",
      "Higher AI Limits",
      "Priority processing",
      "Team Support",
    ],
    button: "Upgrade to Team",
  },
];

const Plan = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const handlePayment=async(plan)=>{
    try {
        if(plan.key=="free" || plan.current) return
        const data=await createPaymentApi(plan.key)
        if (!data?.order?.id || !data?.key_id) {
          throw new Error("Could not create payment order");
        }
        console.log(data);
const options={
    key:data.key_id,
    amount:data.order.amount,
    currency:data.order.currency || "INR",
    name:"Hexora IDE",
    description:`Plan ${plan.name}`,
    order_id:data.order.id,
    handler:async(response)=>{
        try {
          const {razorpay_order_id, razorpay_payment_id, razorpay_signature}=response
          const data=await verifyPaymentApi({razorpay_order_id, razorpay_payment_id, razorpay_signature})

          if (typeof data?.credits !== "number") {
            throw new Error(data?.message || "Payment was verified but credits were not returned");
          }
          dispatch(setUserData({ ...userData, credits: data.credits }));
          window.alert(`Payment successful. Your new balance is ${data.credits} credits.`);
        } catch (error) {
          console.error("Payment verification failed:", error);
          window.alert(error.response?.data?.message || error.message || "Payment verification failed");
        }
    },
    modal: {
        ondismiss: () => console.log("Payment was cancelled"),
    },
    theme:{
        color:"$4f46e5"
    }
}
        const razorpay=new window.Razorpay(options)
        razorpay.open()

        
    } catch (error) {
            console.error("Payment failed:", error);
            window.alert(error.response?.data?.message || error.message || "Payment failed");
            
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 dark:bg-[#07070c] dark:text-white">
      <div className="pointer-events-none fixed left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/[0.08] blur-[140px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="
          flex
          items-center
          gap-2
          rounded-lg
          border
          border-slate-200
          bg-white
          px-3
          py-2
          text-sm
          cursor-pointer
          font-medium
          text-slate-600
          transition
          hover:border-white/[0.08]
          dark:bg-white/[0.03]
          dark:text-slate-300
          dark:hover:bg-white/[0.06]
        "
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div>Hexora IDE</div>
        </div>

        <div className="mc-auto mb-12 max-w-2xl text-center">
          <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-indigo-500/20 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-300">
            <Sparkle size={13} />
            Simple Pricing for developers
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Build More
            <span className="text-indigo-500"> Ship Faster</span>
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Choose a plan that gives you the AI credits you need to build and
            iterate faster
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan, index) => {
            const ICON = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -4,
                }}
                className={`relative flex flex-col rounded-2xl border p-6 transition ${plan.popular ? `border-indigo-500/40 bg-white shadow-xl shadow-indigo-500/10 dark:bg-white/[0.05] ` : `border-slate-200 bg-white/70 dark:border-white/[0.08] dark:bg-white/[0.025]  `}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white  ">
                    Most Popular
                  </div>
                )}

                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-white">
                  <Icon size={16} />
                </div>
                <h1 className="text-lg font-bold">{plan.name}</h1>
                <p className="mt-1 min-h-[40px] text-xs leading-s text-slate-500 dark:text-slate-400  ">
                  {plan.description}
                </p>

                <div className="mt-5 flex items-end gap-1">
                  <span className="text-3xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="mb-1 text-xs text-slate-400">
                    {plan.period}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:border-white/[0.07]dark:bg-white/[0.04] dark:text-slate-200">
                  <Zap
                    size={14}
                    className="text-indigo-500"
                    fill="currentColor"
                  />{" "}
                  {plan.credits}
                </div>

                <button
                onClick={()=>handlePayment(plan)}
                  className={`
                mt-5 w-full rounded-lg cursor-pointer py-2.5 text-xs font-semibold transition
                ${plan.current ? `cursor-default bg-slat-100 text-slate-400 dark:bg-white/[0.06] dark:text-slate-600` : plan.popular ? `bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500` : `bg-slate-900 text-white hover:opacity-90 dark:bg-white dark:text-slate-900`}
                    `}
                >
                  {plan.button}
                </button>

                <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/[0.07]">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Includes
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 "
                      >
                        <Check
                          size={14}
                          className="mt-0.5 shrink-0 text-emerald-500 "
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10 text-center text-[11px] text-slate-400 dark:text-slate-600">
                  Credits reset every month. Unused credits do not roll over.
                </div>



              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Plan;
