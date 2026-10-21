import { axiosInstance } from "../../utils/axiosInstance"


export const loginApi=async (token)=>{
   try {
     const {data}=await axiosInstance.post('/api/auth/login',{token})
    return data
   } catch (error) {
    console.log(error);
    
   }
}