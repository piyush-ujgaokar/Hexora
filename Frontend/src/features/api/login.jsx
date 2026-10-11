import { axiosInstance } from "../../utils/axiosInstance"


export const loginApi=async (token)=>{
    const {data}=await axiosInstance.post('/api/auth/login',{token})
    return data
}