import axios from "axios"



export const deductCredits=async({userId,amount})=>{
    try {
        const {data}=await axios.post(`${process.env.AUTH_SERVICE}/auth/user/deduct-credits`,{
        userId,amount
    })
    if (typeof data?.credits !== "number") {
        throw new Error("Auth service did not return the updated credit balance");
    }
    return data
    } catch (error) {
        throw new Error(`Failed to deduct AI credits: ${error.message}`);
        
    }
}

