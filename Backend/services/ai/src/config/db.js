
import mongoose from "mongoose";



export const connectToDb=async()=>{
        try {
                await mongoose.connect(process.env.MONGO_URI)
                console.log("Ai DataBase Connected Successfully");
                
        } catch (error) {
            console.log(`error while connecting Project Database ${error}`);
            
        }
}