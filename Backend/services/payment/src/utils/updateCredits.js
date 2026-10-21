import axios from "axios"



export const addCredits=async({userId,credits})=>{
    try {
        const {data}=await axios.post(`${process.env.AUTH_SERVICE}/auth/user/add-credits`,{
        userId,credits
    })
    return data
    } catch (error) {
        throw new Error(`Failed to add payment credits: ${error.message}`)
        
    }
}
