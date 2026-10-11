import mongoose from "mongoose"


const connectToDb=async()=>{
    try {
            await mongoose.connect(process.env.MONGO_URI)
            console.log("MongoDb Connected Successfully");
            
    } catch (error) {
        console.log("Error while connecting Db:- ",error);
        
    }
}

export default connectToDb
