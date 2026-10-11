import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { loginApi } from "../features/api/login";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const DashBoard = () => {
  const [loading, setLoading] = useState(false);

  const dispatch=useDispatch()
  const {userData}=useSelector(state=>state.user)

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const loginData = await loginApi(token);
      dispatch(setUserData(loginData.user));
    } catch (error) {
      console.error("Failed to sign in:", error);
    } finally {
      setLoading(false);
    }
  };


  if(!userData){
     return (
    <div className="relative items-center justify-center flex h-screen w-full overflow-hidden bg-slate-50 px-4 transition-colors duration-300 dark:bg-[#07070c]">
      <div className="pointer-events-none absolute -top-32 left-1/2 hidden h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.05] blur-[120px] dark:block " />

      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200/7 bg-white/80 p-8 text-center shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-black/40 ">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-lg shadow-black/5 dark:border-transparent">
          <span className="text-lg font-bold text-slate-900 ">AI </span>
        </div>

        <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          Welcome to Hexora IDE
        </h2>

        <p className="mb-6 text-[13.5px] leading-relaxed text-slate-500 dark:text-slate-400  ">
          Sign in to access your projects and continue building
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className=" flex w-full items-center justify-center
         cursor-pointer gap-3 rounded-lg rounded-lg border border-slate-200 bg-white py-2.5 text-[13.5px] font-medium text-slate-800 shadow-sm transition-colors duration-150 hover:bg-slate-50 disabled:opacity-70 dark:border-transparent dark:bg-white dark:hover:bg-slate-100 "
        >
          <FcGoogle />
          {loading ? "Signing In...." : "Continue With Google"}
        </button>

        <p className=" mt-5 text-[11px] text-slate-400 dark:text-slate-600 ">
          By Continuing you agree to our Terms & Privecy Policy.{" "}
        </p>
      </div>
    </div>
  );
  }

  return (
    <div>

    </div>
  )
 
};

export default DashBoard;
